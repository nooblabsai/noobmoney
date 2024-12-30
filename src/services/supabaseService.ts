import { createClient } from '@supabase/supabase-js';
import { Transaction, RecurringTransaction } from '@/types/transactions';
import { autoTagExpense } from '@/services/categoryService';

const supabaseUrl = 'https://lwdnnudfamnwhgkliors.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZG5udWRmYW1ud2hna2xpb3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNzgyODgsImV4cCI6MjA1MDk1NDI4OH0.v_3j4EViANIti2x7atSaUrhp5e7BcfLEmCuq8UO9Ep0';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signUpUser = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) throw error;
  return data;
};

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const updateTransactionCategories = async (userId: string) => {
  try {
    // First, check if the category column exists
    const { data: columnsData, error: columnsError } = await supabase
      .from('transactions')
      .select()
      .limit(1);

    if (columnsError) {
      console.error('Error checking columns:', columnsError);
      return;
    }

    // If the sample data doesn't have a category property, the column doesn't exist
    if (!columnsData || !columnsData[0]?.hasOwnProperty('category')) {
      console.log('Category column does not exist, skipping category update');
      return;
    }

    // If we reach here, the category column exists, so we can proceed with the update
    const { data: transactions, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .is('category', null);

    if (fetchError) {
      console.error('Error fetching transactions:', fetchError);
      return;
    }

    if (transactions && transactions.length > 0) {
      const updatedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          if (!transaction.is_income) {
            const category = await autoTagExpense(transaction.description);
            return {
              ...transaction,
              category,
            };
          }
          return transaction;
        })
      );

      const { error: updateError } = await supabase
        .from('transactions')
        .upsert(updatedTransactions);

      if (updateError) {
        console.error('Error updating transactions:', updateError);
      }
    }
  } catch (error) {
    console.error('Error in updateTransactionCategories:', error);
  }
};

const transformTransactionForDB = (transaction: Transaction, userId: string) => ({
  id: transaction.id,
  amount: transaction.amount,
  description: transaction.description,
  is_income: transaction.isIncome,
  date: transaction.date,
  category: transaction.category,
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
  category: dbTransaction.category,
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
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    throw new Error('No active session. Please sign in again.');
  }

  const { data: transactionsData, error: transactionsError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId);

  if (transactionsError) {
    throw transactionsError;
  }

  const { data: recurringData, error: recurringError } = await supabase
    .from('recurring_transactions')
    .select('*')
    .eq('user_id', userId);

  if (recurringError) {
    throw recurringError;
  }

  const { data: userData, error: userDataError } = await supabase
    .from('user_data')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (userDataError) {
    console.error('Error loading user data:', userDataError);
    throw userDataError;
  }

  if (!userData) {
    const { data: newUserData, error: createError } = await supabase
      .from('user_data')
      .insert([
        { 
          user_id: userId,
          bank_balance: '0',
          debt_balance: '0',
        }
      ])
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return {
      transactions: transactionsData.map(transformDBToTransaction),
      recurringTransactions: recurringData.map(transformDBToRecurringTransaction),
      bankBalance: '0',
      debtBalance: '0',
    };
  }

  return {
    transactions: transactionsData.map(transformDBToTransaction),
    recurringTransactions: recurringData.map(transformDBToRecurringTransaction),
    bankBalance: userData.bank_balance,
    debtBalance: userData.debt_balance,
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
  
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    throw new Error('No active session. Please sign in again.');
  }

  if (transactions.length > 0) {
    const transformedTransactions = transactions.map(t => transformTransactionForDB(t, userId));
    const { error: transactionError } = await supabase
      .from('transactions')
      .upsert(transformedTransactions);

    if (transactionError) {
      console.error('Error saving transactions:', transactionError);
      throw transactionError;
    }
  }

  if (recurringTransactions.length > 0) {
    const transformedRecurringTransactions = recurringTransactions.map(t => 
      transformRecurringTransactionForDB(t, userId)
    );
    const { error: recurringError } = await supabase
      .from('recurring_transactions')
      .upsert(transformedRecurringTransactions);

    if (recurringError) {
      console.error('Error saving recurring transactions:', recurringError);
      throw recurringError;
    }
  }

  const { error: userDataError } = await supabase
    .from('user_data')
    .insert({
      user_id: userId,
      bank_balance: bankBalance,
      debt_balance: debtBalance,
      updated_at: new Date().toISOString(),
    })
    .select()
    .maybeSingle();

  if (userDataError) {
    console.error('Error saving user data:', userDataError);
    throw userDataError;
  }
};
