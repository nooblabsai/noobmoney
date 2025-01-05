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

    // First, check if user data exists
    const { data: existingUserData } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // Then either update or insert based on existence
    if (existingUserData) {
      const { error: updateError } = await supabase
        .from('user_data')
        .update({
          bank_balance: bankBalance,
          debt_balance: debtBalance
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('user_data')
        .insert({
          user_id: userId,
          bank_balance: bankBalance,
          debt_balance: debtBalance
        });

      if (insertError) throw insertError;
    }

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

    // Load user data
    const { data: userData, error: userDataError } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (userDataError && userDataError.code !== 'PGRST116') throw userDataError;

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