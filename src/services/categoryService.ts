import { ExpenseCategory } from '@/types/categories';
import { supabase } from './supabaseService';

// Simple keyword-based categorization as fallback
const categorizeByKeywords = (description: string): ExpenseCategory => {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('rent') || lowerDesc.includes('mortgage') || lowerDesc.includes('house')) {
    return ExpenseCategory.Housing;
  }
  if (lowerDesc.includes('food') || lowerDesc.includes('grocery') || lowerDesc.includes('restaurant')) {
    return ExpenseCategory.Food;
  }
  if (lowerDesc.includes('bus') || lowerDesc.includes('train') || lowerDesc.includes('taxi') || lowerDesc.includes('uber')) {
    return ExpenseCategory.Transportation;
  }
  if (lowerDesc.includes('doctor') || lowerDesc.includes('medicine') || lowerDesc.includes('hospital')) {
    return ExpenseCategory.Healthcare;
  }
  if (lowerDesc.includes('movie') || lowerDesc.includes('netflix') || lowerDesc.includes('spotify')) {
    return ExpenseCategory.Entertainment;
  }
  if (lowerDesc.includes('clothes') || lowerDesc.includes('shoes') || lowerDesc.includes('amazon')) {
    return ExpenseCategory.Shopping;
  }
  if (lowerDesc.includes('electric') || lowerDesc.includes('water') || lowerDesc.includes('gas') || lowerDesc.includes('internet')) {
    return ExpenseCategory.Utilities;
  }
  if (lowerDesc.includes('school') || lowerDesc.includes('course') || lowerDesc.includes('book')) {
    return ExpenseCategory.Education;
  }
  if (lowerDesc.includes('flight') || lowerDesc.includes('hotel') || lowerDesc.includes('vacation')) {
    return ExpenseCategory.Travel;
  }
  
  return ExpenseCategory.Other;
};

export const autoTagExpense = async (description: string): Promise<ExpenseCategory> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('No active session, using keyword-based categorization');
      return categorizeByKeywords(description);
    }

    const { data: settings } = await supabase
      .from('user_settings')
      .select('openai_api_key')
      .eq('user_id', session.user.id)
      .single();

    if (!settings?.openai_api_key) {
      console.log('No OpenAI API key found, using keyword-based categorization');
      return categorizeByKeywords(description);
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
      console.error('Failed to auto-tag expense, using keyword-based categorization');
      return categorizeByKeywords(description);
    }

    const data = await response.json();
    const suggestedCategory = data.choices[0].message.content.toLowerCase().trim();
    
    return Object.values(ExpenseCategory).includes(suggestedCategory as ExpenseCategory)
      ? suggestedCategory as ExpenseCategory
      : categorizeByKeywords(description);
  } catch (error) {
    console.error('Error auto-tagging expense:', error);
    return categorizeByKeywords(description);
  }
};