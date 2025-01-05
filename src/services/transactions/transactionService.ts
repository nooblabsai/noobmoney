import { Transaction, RecurringTransaction } from '@/types/transactions';
import { supabase } from '@/lib/supabaseClient';
import {
  transformTransactionForDB,
  transformRecurringTransactionForDB,
  transformDBToTransaction,
  transformDBToRecurringTransaction
} from './transactionTransformers';

export const updateTransactionCategories = async (userId: string) => {
  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId);

  if (transactionsError) {
    console.error('Error fetching transactions:', transactionsError);
    return;
  }

  const transactionsToUpdate = transactions.filter(t => !t.category);
  
  for (const transaction of transactionsToUpdate) {
    const { error: updateError } = await supabase
      .from('transactions')
      .update({ category: 'other' })
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Error updating transaction category:', updateError);
    }
  }
};

export const loadTransactions = async (userId: string) => {
  console.log('Loading transactions for user ID:', userId);
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    // Delete all existing transactions for this user first
    const { error: deleteTransactionsError } = await supabase
      .from('transactions')
      .delete()
      .eq('user_id', userId);

    if (deleteTransactionsError) {
      console.error('Error deleting existing transactions:', deleteTransactionsError);
      throw deleteTransactionsError;
    }

    // Delete all existing recurring transactions for this user
    const { error: deleteRecurringError } = await supabase
      .from('recurring_transactions')
      .delete()
      .eq('user_id', userId);

    if (deleteRecurringError) {
      console.error('Error deleting existing recurring transactions:', deleteRecurringError);
      throw deleteRecurringError;
    }

    // Load transactions
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (transactionsError) {
      console.error('Error loading transactions:', transactionsError);
      throw transactionsError;
    }

    // Load recurring transactions
    const { data: recurringData, error: recurringError } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('user_id', userId);

    if (recurringError) {
      console.error('Error loading recurring transactions:', recurringError);
      throw recurringError;
    }

    // Load user data (bank balance and debt balance)
    const { data: userData, error: userDataError } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (userDataError && userDataError.code !== 'PGRST116') {
      console.error('Error loading user data:', userDataError);
      throw userDataError;
    }

    console.log('Loaded transactions:', transactionsData);
    console.log('Loaded recurring transactions:', recurringData);
    console.log('Loaded user data:', userData);

    const transactions = transactionsData ? transactionsData.map(transformDBToTransaction) : [];
    const recurringTransactions = recurringData ? recurringData.map(transformDBToRecurringTransaction) : [];

    return {
      transactions,
      recurringTransactions,
      bankBalance: userData?.bank_balance || '0',
      debtBalance: userData?.debt_balance || '0',
    };
  } catch (error) {
    console.error('Error in loadTransactions:', error);
    throw error;
  }
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
    throw new Error('No active session');
  }

  // First, delete all existing transactions for this user
  const { error: deleteTransactionsError } = await supabase
    .from('transactions')
    .delete()
    .eq('user_id', userId);

  if (deleteTransactionsError) {
    console.error('Error deleting existing transactions:', deleteTransactionsError);
    throw deleteTransactionsError;
  }

  // Delete all existing recurring transactions for this user
  const { error: deleteRecurringError } = await supabase
    .from('recurring_transactions')
    .delete()
    .eq('user_id', userId);

  if (deleteRecurringError) {
    console.error('Error deleting existing recurring transactions:', deleteRecurringError);
    throw deleteRecurringError;
  }

  // Now insert the current transactions
  if (transactions.length > 0) {
    const transformedTransactions = transactions.map(t => transformTransactionForDB(t, userId));
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert(transformedTransactions);

    if (transactionError) {
      console.error('Error saving transactions:', transactionError);
      throw transactionError;
    }
  }

  // Insert the current recurring transactions
  if (recurringTransactions.length > 0) {
    const transformedRecurringTransactions = recurringTransactions.map(t => 
      transformRecurringTransactionForDB(t, userId)
    );
    const { error: recurringError } = await supabase
      .from('recurring_transactions')
      .insert(transformedRecurringTransactions);

    if (recurringError) {
      console.error('Error saving recurring transactions:', recurringError);
      throw recurringError;
    }
  }

  // Update user data
  const { error: userDataError } = await supabase
    .from('user_data')
    .upsert({
      user_id: userId,
      bank_balance: bankBalance,
      debt_balance: debtBalance,
      updated_at: new Date().toISOString(),
    });

  if (userDataError) {
    console.error('Error saving user data:', userDataError);
    throw userDataError;
  }

  // Clear local storage after successful save
  localStorage.removeItem('transactions');
  localStorage.removeItem('recurringTransactions');
  localStorage.setItem('bankBalance', bankBalance);
  localStorage.setItem('debtBalance', debtBalance);
};