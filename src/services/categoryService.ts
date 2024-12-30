import { ExpenseCategory } from '@/types/categories';
import { supabase } from './supabaseService';

const getStoredApiKey = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase
      .from('user_settings')
      .select('openai_api_key')
      .eq('user_id', session.user.id)
      .single();

    if (error) throw error;
    return data?.openai_api_key;
  } catch (error) {
    console.error('Error fetching API key:', error);
    return null;
  }
};

export const autoTagExpense = async (description: string): Promise<ExpenseCategory> => {
  try {
    const apiKey = await getStoredApiKey();
    
    if (!apiKey) {
      console.log('No OpenAI API key found, using fallback categorization');
      return fallbackCategorization(description);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a financial categorization assistant. Categorize the expense into exactly one of these categories: ${Object.values(ExpenseCategory).join(', ')}. Respond with only the category name in lowercase.`
          },
          {
            role: 'user',
            content: `Categorize this expense: "${description}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      console.log('OpenAI API error, using fallback categorization');
      return fallbackCategorization(description);
    }

    const data = await response.json();
    const suggestedCategory = data.choices[0].message.content.toLowerCase().trim();
    
    if (Object.values(ExpenseCategory).includes(suggestedCategory as ExpenseCategory)) {
      console.log(`OpenAI categorized "${description}" as ${suggestedCategory}`);
      return suggestedCategory as ExpenseCategory;
    }

    console.log('Invalid category from OpenAI, using fallback categorization');
    return fallbackCategorization(description);
  } catch (error) {
    console.error('Error in OpenAI categorization:', error);
    return fallbackCategorization(description);
  }
};

const fallbackCategorization = (description: string): ExpenseCategory => {
  const lowerDesc = description.toLowerCase();
  
  const keywordMap: Record<string, ExpenseCategory> = {
    // Housing related
    'rent': ExpenseCategory.Housing,
    'mortgage': ExpenseCategory.Housing,
    'apartment': ExpenseCategory.Housing,
    'house': ExpenseCategory.Housing,
    'maintenance': ExpenseCategory.Housing,
    'repair': ExpenseCategory.Housing,
    
    // Food related
    'food': ExpenseCategory.Food,
    'grocery': ExpenseCategory.Food,
    'restaurant': ExpenseCategory.Food,
    'dining': ExpenseCategory.Food,
    'meal': ExpenseCategory.Food,
    
    // Transportation
    'uber': ExpenseCategory.Transportation,
    'taxi': ExpenseCategory.Transportation,
    'bus': ExpenseCategory.Transportation,
    'train': ExpenseCategory.Transportation,
    'gas': ExpenseCategory.Transportation,
    'fuel': ExpenseCategory.Transportation,
    
    // Healthcare
    'doctor': ExpenseCategory.Healthcare,
    'medical': ExpenseCategory.Healthcare,
    'pharmacy': ExpenseCategory.Healthcare,
    'health': ExpenseCategory.Healthcare,
    'dental': ExpenseCategory.Healthcare,
    
    // Entertainment
    'movie': ExpenseCategory.Entertainment,
    'netflix': ExpenseCategory.Entertainment,
    'spotify': ExpenseCategory.Entertainment,
    'game': ExpenseCategory.Entertainment,
    
    // Shopping
    'clothes': ExpenseCategory.Shopping,
    'amazon': ExpenseCategory.Shopping,
    'shopping': ExpenseCategory.Shopping,
    'store': ExpenseCategory.Shopping,
    
    // Utilities
    'electric': ExpenseCategory.Utilities,
    'water': ExpenseCategory.Utilities,
    'internet': ExpenseCategory.Utilities,
    'phone': ExpenseCategory.Utilities,
    
    // Education
    'school': ExpenseCategory.Education,
    'course': ExpenseCategory.Education,
    'books': ExpenseCategory.Education,
    'tuition': ExpenseCategory.Education,
    
    // Travel
    'flight': ExpenseCategory.Travel,
    'hotel': ExpenseCategory.Travel,
    'vacation': ExpenseCategory.Travel,
    'trip': ExpenseCategory.Travel,
  };

  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (lowerDesc.includes(keyword)) {
      console.log(`Fallback categorized "${description}" as ${category} based on keyword "${keyword}"`);
      return category;
    }
  }
  
  console.log(`No specific category found for "${description}", defaulting to Other`);
  return ExpenseCategory.Other;
};