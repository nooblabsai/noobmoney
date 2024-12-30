import { ExpenseCategory } from '@/types/categories';

const keywordMap: Record<string, ExpenseCategory> = {
  'rent': ExpenseCategory.Housing,
  'mortgage': ExpenseCategory.Housing,
  'apartment': ExpenseCategory.Housing,
  'food': ExpenseCategory.Food,
  'grocery': ExpenseCategory.Food,
  'groceries': ExpenseCategory.Food,
  'restaurant': ExpenseCategory.Food,
  'uber': ExpenseCategory.Transportation,
  'taxi': ExpenseCategory.Transportation,
  'bus': ExpenseCategory.Transportation,
  'train': ExpenseCategory.Transportation,
  'doctor': ExpenseCategory.Healthcare,
  'medical': ExpenseCategory.Healthcare,
  'pharmacy': ExpenseCategory.Healthcare,
  'movie': ExpenseCategory.Entertainment,
  'netflix': ExpenseCategory.Entertainment,
  'spotify': ExpenseCategory.Entertainment,
  'hbo': ExpenseCategory.Entertainment,
  'clothes': ExpenseCategory.Shopping,
  'amazon': ExpenseCategory.Shopping,
  'shopping': ExpenseCategory.Shopping,
  'electric': ExpenseCategory.Utilities,
  'water': ExpenseCategory.Utilities,
  'gas': ExpenseCategory.Utilities,
  'internet': ExpenseCategory.Utilities,
  'phone': ExpenseCategory.Utilities,
  'school': ExpenseCategory.Education,
  'course': ExpenseCategory.Education,
  'books': ExpenseCategory.Education,
  'tuition': ExpenseCategory.Education,
  'flight': ExpenseCategory.Travel,
  'hotel': ExpenseCategory.Travel,
  'vacation': ExpenseCategory.Travel,
  'airbnb': ExpenseCategory.Travel,
};

export const autoTagExpense = async (description: string): Promise<ExpenseCategory> => {
  const lowerDesc = description.toLowerCase();
  
  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (lowerDesc.includes(keyword)) {
      console.log(`Categorized "${description}" as ${category} based on keyword "${keyword}"`);
      return category;
    }
  }
  
  console.log(`No specific category found for "${description}", defaulting to Other`);
  return ExpenseCategory.Other;
};