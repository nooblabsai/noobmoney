import { Transaction, RecurringTransaction } from '@/types/transactions';
import { supabase } from '../auth/authService';
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

  // Update transactions that don't have categories
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
