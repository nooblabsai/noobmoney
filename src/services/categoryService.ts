import { ExpenseCategory } from '@/types/categories';
import { supabase } from './supabaseService';

export const autoTagExpense = async (description: string): Promise<ExpenseCategory> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data: settings } = await supabase
      .from('user_settings')
      .select('openai_api_key')
      .eq('user_id', session.user.id)
      .single();

    if (!settings?.openai_api_key) {
      return ExpenseCategory.Other;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.openai_api_key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a financial categorization assistant. Categorize expenses into one of these categories: ${Object.values(ExpenseCategory).join(', ')}. Respond with ONLY the category name, nothing else.`
          },
          {
            role: 'user',
            content: `Categorize this expense: ${description}`
          }
        ],
        temperature: 0.3,
        max_tokens: 20,
      }),
    });

    if (!response.ok) {
      console.error('Failed to auto-tag expense');
      return ExpenseCategory.Other;
    }

    const data = await response.json();
    const suggestedCategory = data.choices[0].message.content.toLowerCase().trim();
    
    return Object.values(ExpenseCategory).includes(suggestedCategory as ExpenseCategory)
      ? suggestedCategory as ExpenseCategory
      : ExpenseCategory.Other;
  } catch (error) {
    console.error('Error auto-tagging expense:', error);
    return ExpenseCategory.Other;
  }
};