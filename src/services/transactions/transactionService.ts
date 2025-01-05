import { supabase, checkSession } from '@/lib/supabaseClient';
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
    // Check session validity before proceeding
    const session = await checkSession();
    if (!session) {
      throw new Error('Invalid session');
    }

    // Transform transactions for storage
    const transformedTransactions = transformTransactionsForStorage(transactions);
    const transformedRecurringTransactions = transformTransactionsForStorage(recurringTransactions);

    // Delete existing data
    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting existing transactions:', deleteError);
      throw deleteError;
    }

    // Insert new transactions
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert(transformedTransactions.map(transaction => ({
        ...transaction,
        user_id: userId
      })));

    if (transactionError) {
      console.error('Error saving transactions:', transactionError);
      throw transactionError;
    }

    // Save recurring transactions
    const { error: recurringError } = await supabase
      .from('recurring_transactions')
      .upsert(
        transformedRecurringTransactions.map(transaction => ({
          ...transaction,
          user_id: userId
        })),
        { onConflict: 'user_id,id' }
      );

    if (recurringError) {
      console.error('Error saving recurring transactions:', recurringError);
      throw recurringError;
    }

    // Save user data (balances)
    const { error: userDataError } = await supabase
      .from('user_data')
      .upsert({
        user_id: userId,
        bank_balance: bankBalance,
        debt_balance: debtBalance
      }, { onConflict: 'user_id' });

    if (userDataError) {
      console.error('Error saving user data:', userDataError);
      throw userDataError;
    }

    // Update local storage with current data
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions));
    localStorage.setItem('bankBalance', bankBalance);
    localStorage.setItem('debtBalance', debtBalance);
    
    console.log('All data saved successfully');
  } catch (error) {
    console.error('Error in saveTransactions:', error);
    throw error;
  }
};

export const loadTransactions = async (userId: string) => {
  try {
    const { data: transactions, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (transactionError) {
      console.error('Error loading transactions:', transactionError);
      throw transactionError;
    }

    const { data: recurringTransactions, error: recurringError } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('user_id', userId);

    if (recurringError) {
      console.error('Error loading recurring transactions:', recurringError);
      throw recurringError;
    }

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
      transactions: transformTransactionsFromStorage(transactions),
      recurringTransactions: transformTransactionsFromStorage(recurringTransactions),
      bankBalance: userData.bank_balance,
      debtBalance: userData.debt_balance,
    };
  } catch (error) {
    console.error('Error in loadTransactions:', error);
    throw error;
  }
};
