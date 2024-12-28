import { createClient } from '@supabase/supabase-js';
import { Transaction, RecurringTransaction } from '@/types/transactions';

const supabaseUrl = 'https://lwdnnudfamnwhgkliors.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZG5udWRmYW1ud2hna2xpb3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNzgyODgsImV4cCI6MjA1MDk1NDI4OH0.v_3j4EViANIti2x7atSaUrhp5e7BcfLEmCuq8UO9Ep0';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signUpUser = async (email: string, password: string, name: string) => {
  console.log('Attempting to sign up user:', email);
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
  console.log('User signed up successfully:', data);
  return data;
};

const transformTransactionForDB = (transaction: Transaction, userId: string) => ({
  id: transaction.id,
  amount: transaction.amount,
  description: transaction.description,
  is_income: transaction.isIncome,
  date: transaction.date,
  user_id: userId,
  created_at: new Date().toISOString(),
});

const transformRecurringTransactionForDB = (transaction: RecurringTransaction, userId: string) => ({
  id: transaction.id,
  amount: transaction.amount,
  description: transaction.description,
  is_income: transaction.isIncome,
  start_date: transaction.startDate,
  user_id: userId,
  created_at: new Date().toISOString(),
});

export const saveTransactions = async (userId: string, transactions: Transaction[], recurringTransactions: RecurringTransaction[]) => {
  console.log('Saving transactions for user:', userId);
  console.log('Regular transactions:', transactions);
  console.log('Recurring transactions:', recurringTransactions);

  // Save regular transactions
  if (transactions.length > 0) {
    const transformedTransactions = transactions.map(t => transformTransactionForDB(t, userId));
    console.log('Transformed transactions:', transformedTransactions);

    const { error: transactionError } = await supabase
      .from('transactions')
      .upsert(transformedTransactions);

    if (transactionError) {
      console.error('Error saving transactions:', transactionError);
      throw transactionError;
    }
    console.log('Regular transactions saved successfully');
  }

  // Save recurring transactions
  if (recurringTransactions.length > 0) {
    const transformedRecurringTransactions = recurringTransactions.map(t => 
      transformRecurringTransactionForDB(t, userId)
    );
    console.log('Transformed recurring transactions:', transformedRecurringTransactions);

    const { error: recurringError } = await supabase
      .from('recurring_transactions')
      .upsert(transformedRecurringTransactions);

    if (recurringError) {
      console.error('Error saving recurring transactions:', recurringError);
      throw recurringError;
    }
    console.log('Recurring transactions saved successfully');
  }
};