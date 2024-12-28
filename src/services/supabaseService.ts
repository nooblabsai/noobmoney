import { createClient } from '@supabase/supabase-js';
import { Transaction, RecurringTransaction } from '@/types/transactions';

const supabaseUrl = 'https://lwdnnudfamnwhgkliors.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZG5udWRmYW1ud2hna2xpb3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNzgyODgsImV4cCI6MjA1MDk1NDI4OH0.v_3j4EViANIti2x7atSaUrhp5e7BcfLEmCuq8UO9Ep0';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signUpUser = async (email: string, password: string, name: string) => {
  console.log('Attempting to sign up user:', email);
  
  // First check if user exists
  const { data: existingUser } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (existingUser.user) {
    console.log('User already exists, signing in:', existingUser.user);
    return existingUser;
  }

  // If user doesn't exist, sign them up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  
  if (error) {
    console.error('Sign up error:', error);
    throw error;
  }

  // Create initial user_data entry
  const { error: profileError } = await supabase
    .from('user_data')
    .insert([
      { 
        user_id: data.user?.id,
        bank_balance: '0',
        debt_balance: '0',
      }
    ]);

  if (profileError) {
    console.error('Error creating user profile:', profileError);
    throw profileError;
  }

  return data;
};

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

const transformTransactionForDB = (transaction: Transaction, userId: string) => ({
  id: transaction.id,
  amount: transaction.amount,
  description: transaction.description,
  is_income: transaction.isIncome,
  date: transaction.date,
  user_id: userId,
});

const transformRecurringTransactionForDB = (transaction: RecurringTransaction, userId: string) => ({
  id: transaction.id,
  amount: transaction.amount,
  description: transaction.description,
  is_income: transaction.isIncome,
  start_date: transaction.startDate,
  user_id: userId,
});

const transformDBToTransaction = (dbTransaction: any): Transaction => ({
  id: dbTransaction.id,
  amount: dbTransaction.amount,
  description: dbTransaction.description,
  isIncome: dbTransaction.is_income,
  date: new Date(dbTransaction.date),
});

const transformDBToRecurringTransaction = (dbTransaction: any): RecurringTransaction => ({
  id: dbTransaction.id,
  amount: dbTransaction.amount,
  description: dbTransaction.description,
  isIncome: dbTransaction.is_income,
  date: new Date(dbTransaction.start_date),
  startDate: new Date(dbTransaction.start_date),
});

export const loadTransactions = async (userId: string) => {
  // Verify we have an active session
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    throw new Error('No active session. Please sign in again.');
  }

  // Load regular transactions
  const { data: transactionsData, error: transactionsError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId);

  if (transactionsError) {
    throw transactionsError;
  }

  // Load recurring transactions
  const { data: recurringData, error: recurringError } = await supabase
    .from('recurring_transactions')
    .select('*')
    .eq('user_id', userId);

  if (recurringError) {
    throw recurringError;
  }

  // Load user data (including balances)
  const { data: userData, error: userDataError } = await supabase
    .from('user_data')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (userDataError) {
    console.error('Error loading user data:', userDataError);
    throw userDataError;
  }

  return {
    transactions: transactionsData.map(transformDBToTransaction),
    recurringTransactions: recurringData.map(transformDBToRecurringTransaction),
    bankBalance: userData?.bank_balance || '0',
    debtBalance: userData?.debt_balance || '0',
  };
};

export const saveTransactions = async (
  userId: string, 
  transactions: Transaction[], 
  recurringTransactions: RecurringTransaction[],
  bankBalance: string,
  debtBalance: string,
) => {
  console.log('Saving transactions for user:', userId);
  
  // Verify we have an active session
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    throw new Error('No active session. Please sign in again.');
  }

  // Save regular transactions
  if (transactions.length > 0) {
    const transformedTransactions = transactions.map(t => transformTransactionForDB(t, userId));
    const { error: transactionError } = await supabase
      .from('transactions')
      .upsert(transformedTransactions, {
        onConflict: 'id'
      });

    if (transactionError) {
      console.error('Error saving transactions:', transactionError);
      throw transactionError;
    }
  }

  // Save recurring transactions
  if (recurringTransactions.length > 0) {
    const transformedRecurringTransactions = recurringTransactions.map(t => 
      transformRecurringTransactionForDB(t, userId)
    );
    const { error: recurringError } = await supabase
      .from('recurring_transactions')
      .upsert(transformedRecurringTransactions, {
        onConflict: 'id'
      });

    if (recurringError) {
      console.error('Error saving recurring transactions:', recurringError);
      throw recurringError;
    }
  }

  // Update user data (including balances)
  const { error: userDataError } = await supabase
    .from('user_data')
    .upsert({
      user_id: userId,
      bank_balance: bankBalance,
      debt_balance: debtBalance,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    });

  if (userDataError) {
    console.error('Error saving user data:', userDataError);
    throw userDataError;
  }
};