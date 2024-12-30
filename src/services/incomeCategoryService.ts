import { IncomeCategory } from '@/types/incomeCategories';
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

export const autoTagIncome = async (description: string): Promise<IncomeCategory> => {
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
            content: `You are a financial categorization assistant. Categorize the income into exactly one of these categories: ${Object.values(IncomeCategory).join(', ')}. Respond with only the category name in lowercase.`
          },
          {
            role: 'user',
            content: `Categorize this income: "${description}"`
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
    
    if (Object.values(IncomeCategory).includes(suggestedCategory as IncomeCategory)) {
      console.log(`OpenAI categorized "${description}" as ${suggestedCategory}`);
      return suggestedCategory as IncomeCategory;
    }

    console.log('Invalid category from OpenAI, using fallback categorization');
    return fallbackCategorization(description);
  } catch (error) {
    console.error('Error in OpenAI categorization:', error);
    return fallbackCategorization(description);
  }
};

const fallbackCategorization = (description: string): IncomeCategory => {
  const lowerDesc = description.toLowerCase();
  
  const keywordMap: Record<string, IncomeCategory> = {
    // Salary related
    'salary': IncomeCategory.Salary,
    'wage': IncomeCategory.Salary,
    'paycheck': IncomeCategory.Salary,
    'pay': IncomeCategory.Salary,
    
    // Freelance related
    'freelance': IncomeCategory.Freelance,
    'contract': IncomeCategory.Freelance,
    'gig': IncomeCategory.Freelance,
    'project': IncomeCategory.Freelance,
    
    // Investments
    'dividend': IncomeCategory.Investments,
    'interest': IncomeCategory.Investments,
    'stock': IncomeCategory.Investments,
    'investment': IncomeCategory.Investments,
    
    // Rent
    'rent': IncomeCategory.Rent,
    'lease': IncomeCategory.Rent,
    'tenant': IncomeCategory.Rent,
    
    // Business
    'sales': IncomeCategory.Business,
    'revenue': IncomeCategory.Business,
    'business': IncomeCategory.Business,
    'profit': IncomeCategory.Business,
    
    // Customer Payment
    'customer': IncomeCategory.CustomerPayment,
    'client': IncomeCategory.CustomerPayment,
    'payment': IncomeCategory.CustomerPayment,
    'invoice': IncomeCategory.CustomerPayment,
    
    // Refund
    'refund': IncomeCategory.Refund,
    'return': IncomeCategory.Refund,
    'reimbursement': IncomeCategory.Refund,
    
    // Gift
    'gift': IncomeCategory.Gift,
    'present': IncomeCategory.Gift,
    'donation': IncomeCategory.Gift,
  };

  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (lowerDesc.includes(keyword)) {
      console.log(`Fallback categorized "${description}" as ${category} based on keyword "${keyword}"`);
      return category;
    }
  }
  
  console.log(`No specific category found for "${description}", defaulting to Other`);
  return IncomeCategory.Other;
};