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
  
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    throw new Error('No active session');
  }

  const { data: transactionsData, error: transactionsError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId);

  if (transactionsError) {
    console.error('Error loading transactions:', transactionsError);
    throw transactionsError;
  }

  const { data: recurringData, error: recurringError } = await supabase
    .from('recurring_transactions')
    .select('*')
    .eq('user_id', userId);

  if (recurringError) {
    console.error('Error loading recurring transactions:', recurringError);
    throw recurringError;
  }

  console.log('Loaded transactions:', transactionsData);
  console.log('Loaded recurring transactions:', recurringData);

  // Changed this part to handle no user data case
  const { data: userData, error: userDataError } = await supabase
    .from('user_data')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);

  // Only log real errors, not the "no data" case
  if (userDataError && userDataError.code !== 'PGRST116') {
    console.error('Error loading user data:', userDataError);
    throw userDataError;
  }

  const transactions = transactionsData ? transactionsData.map(transformDBToTransaction) : [];
  const recurringTransactions = recurringData ? recurringData.map(transformDBToRecurringTransaction) : [];

  // Use the first user data record if it exists, otherwise use defaults
  const userDataRecord = userData && userData.length > 0 ? userData[0] : null;

  return {
    transactions,
    recurringTransactions,
    bankBalance: userDataRecord?.bank_balance || '0',
    debtBalance: userDataRecord?.debt_balance || '0',
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
    throw new Error('No active session');
  }

  if (transactions.length > 0) {
    const transformedTransactions = transactions.map(t => transformTransactionForDB(t, userId));
    const { error: transactionError } = await supabase
      .from('transactions')
      .upsert(transformedTransactions, { onConflict: 'id' });

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
      .upsert(transformedRecurringTransactions, { onConflict: 'id' });

    if (recurringError) {
      console.error('Error saving recurring transactions:', recurringError);
      throw recurringError;
    }
  }

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
};