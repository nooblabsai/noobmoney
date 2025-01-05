import { supabase } from '@/lib/supabaseClient';
import { Transaction, RecurringTransaction } from '@/types/transactions';

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

    // Save new transactions
    if (transactions.length > 0) {
      const transformedTransactions = transactions.map(t => ({
        ...t,
        user_id: userId,
        date: new Date(t.date).toISOString(),
        is_income: t.isIncome // Map isIncome to is_income
      }));
      
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert(transformedTransactions);

      if (transactionError) throw transactionError;
    }

    // Save new recurring transactions
    if (recurringTransactions.length > 0) {
      const transformedRecurringTransactions = recurringTransactions.map(t => ({
        ...t,
        user_id: userId,
        start_date: new Date(t.startDate).toISOString(),
        is_income: t.isIncome // Map isIncome to is_income
      }));
      
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
      }, { 
        onConflict: 'user_id'
      });

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
    // Load transactions
    const { data: transactions, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (transactionError) throw transactionError;

    // Load recurring transactions
    const { data: recurringTransactions, error: recurringError } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('user_id', userId);

    if (recurringError) throw recurringError;

    // Load user data with proper single row handling
    const { data: userData, error: userDataError } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (userDataError && userDataError.code !== 'PGRST116') throw userDataError;

    // Transform the data back to the expected format
    const transformedTransactions = (transactions || []).map(t => ({
      ...t,
      date: new Date(t.date),
      isIncome: t.is_income // Map is_income back to isIncome
    }));

    const transformedRecurringTransactions = (recurringTransactions || []).map(t => ({
      ...t,
      startDate: new Date(t.start_date),
      isIncome: t.is_income // Map is_income back to isIncome
    }));

    return {
      transactions: transformedTransactions,
      recurringTransactions: transformedRecurringTransactions,
      bankBalance: userData?.bank_balance || '0',
      debtBalance: userData?.debt_balance || '0'
    };
  } catch (error) {
    console.error('Error loading transactions:', error);
    throw error;
  }
};