import { supabase } from '@/lib/supabaseClient';
import { Transaction, RecurringTransaction } from '@/types/transactions';
import { transformTransactionsForStorage, transformTransactionsFromStorage } from './transactionTransformers';

export const saveTransactions = async (
  userId: string,
  transactions: Transaction[],
  recurringTransactions: RecurringTransaction[],
  bankBalance: string,
  debtBalance: string
) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('No active session');
    }

    // Delete existing transactions
    await supabase
      .from('transactions')
      .delete()
      .eq('user_id', userId);

    await supabase
      .from('recurring_transactions')
      .delete()
      .eq('user_id', userId);

    // Transform and save new transactions
    if (transactions.length > 0) {
      const transformedTransactions = transformTransactionsForStorage(transactions, userId);
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert(transformedTransactions);

      if (transactionError) throw transactionError;
    }

    // Transform and save new recurring transactions
    if (recurringTransactions.length > 0) {
      const transformedRecurringTransactions = transformTransactionsForStorage(recurringTransactions, userId);
      const { error: recurringError } = await supabase
        .from('recurring_transactions')
        .insert(transformedRecurringTransactions);

      if (recurringError) throw recurringError;
    }

    // Update user data (balances)
    const { error: userDataError } = await supabase
      .from('user_data')
      .upsert({
        user_id: userId,
        bank_balance: bankBalance,
        debt_balance: debtBalance
      }, { onConflict: 'user_id' });

    if (userDataError) throw userDataError;

    // Update local storage
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions));
    localStorage.setItem('bankBalance', bankBalance);
    localStorage.setItem('debtBalance', debtBalance);

  } catch (error) {
    console.error('Error saving transactions:', error);
    throw error;
  }
};

export const loadTransactions = async (userId: string) => {
  try {
    const { data: transactions, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (transactionError) throw transactionError;

    const { data: recurringTransactions, error: recurringError } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('user_id', userId);

    if (recurringError) throw recurringError;

    const { data: userData, error: userDataError } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (userDataError && userDataError.code !== 'PGRST116') throw userDataError;

    return {
      transactions: transformTransactionsFromStorage(transactions || []),
      recurringTransactions: transformTransactionsFromStorage(recurringTransactions || []),
      bankBalance: userData?.bank_balance || '0',
      debtBalance: userData?.debt_balance || '0'
    };
  } catch (error) {
    console.error('Error loading transactions:', error);
    throw error;
  }
};