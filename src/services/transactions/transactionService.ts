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
        id: t.id,
        amount: t.amount,
        description: t.description,
        is_income: t.isIncome,
        date: new Date(t.date).toISOString(),
        category: t.category,
        user_id: userId
      }));
      
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert(transformedTransactions);

      if (transactionError) throw transactionError;
    }

    // Save new recurring transactions
    if (recurringTransactions.length > 0) {
      const transformedRecurringTransactions = recurringTransactions.map(t => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        is_income: t.isIncome,
        start_date: new Date(t.startDate).toISOString(),
        category: t.category,
        user_id: userId
      }));
      
      const { error: recurringError } = await supabase
        .from('recurring_transactions')
        .insert(transformedRecurringTransactions);

      if (recurringError) throw recurringError;
    }

    // First, delete any existing user data
    await supabase
      .from('user_data')
      .delete()
      .eq('user_id', userId);

    // Then insert new user data
    const { error: insertError } = await supabase
      .from('user_data')
      .insert({
        user_id: userId,
        bank_balance: bankBalance,
        debt_balance: debtBalance
      });

    if (insertError) throw insertError;

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
      .select('id, amount, description, is_income, date, category, user_id')
      .eq('user_id', userId);

    if (transactionError) throw transactionError;

    // Load recurring transactions
    const { data: recurringTransactions, error: recurringError } = await supabase
      .from('recurring_transactions')
      .select('id, amount, description, is_income, start_date, category, user_id')
      .eq('user_id', userId);

    if (recurringError) throw recurringError;

    // Load user data - get the most recent entry
    const { data: userDataArray, error: userDataError } = await supabase
      .from('user_data')
      .select('bank_balance, debt_balance')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (userDataError) throw userDataError;

    const userData = userDataArray?.[0];

    // Transform the data back to the expected format
    const transformedTransactions = (transactions || []).map(t => ({
      id: t.id,
      amount: t.amount,
      description: t.description,
      isIncome: t.is_income,
      date: new Date(t.date),
      category: t.category
    }));

    const transformedRecurringTransactions = (recurringTransactions || []).map(t => ({
      id: t.id,
      amount: t.amount,
      description: t.description,
      isIncome: t.is_income,
      startDate: new Date(t.start_date),
      category: t.category
    }));

    // Store in localStorage
    localStorage.setItem('transactions', JSON.stringify(transformedTransactions));
    localStorage.setItem('recurringTransactions', JSON.stringify(transformedRecurringTransactions));
    
    const bankBalance = userData?.bank_balance || '0';
    const debtBalance = userData?.debt_balance || '0';
    
    localStorage.setItem('bankBalance', bankBalance);
    localStorage.setItem('debtBalance', debtBalance);

    return {
      transactions: transformedTransactions,
      recurringTransactions: transformedRecurringTransactions,
      bankBalance,
      debtBalance
    };
  } catch (error) {
    console.error('Error loading transactions:', error);
    throw error;
  }
};