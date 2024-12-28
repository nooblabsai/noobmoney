import { createClient } from '@supabase/supabase-js';
import { Transaction, RecurringTransaction } from '@/types/transactions';

const supabaseUrl = 'https://YOUR_PROJECT_URL.supabase.co';
const supabaseKey = 'YOUR_ANON_KEY';

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