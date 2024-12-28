import { createClient } from '@supabase/supabase-js';
import { Transaction, RecurringTransaction } from '@/types/transactions';

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

export const saveTransactions = async (userId: string, transactions: Transaction[], recurringTransactions: RecurringTransaction[]) => {
  const { error: transactionError } = await supabase
    .from('transactions')
    .upsert(
      transactions.map(t => ({
        ...t,
        user_id: userId,
        created_at: new Date().toISOString(),
      }))
    );

  if (transactionError) throw transactionError;

  const { error: recurringError } = await supabase
    .from('recurring_transactions')
    .upsert(
      recurringTransactions.map(t => ({
        ...t,
        user_id: userId,
        created_at: new Date().toISOString(),
      }))
    );

  if (recurringError) throw recurringError;
};