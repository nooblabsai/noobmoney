import { ExpenseCategory } from '@/types/categories';

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
  'groceries': ExpenseCategory.Food,
  'restaurant': ExpenseCategory.Food,
  'dining': ExpenseCategory.Food,
  'meal': ExpenseCategory.Food,
  'lunch': ExpenseCategory.Food,
  'dinner': ExpenseCategory.Food,
  
  // Transportation
  'uber': ExpenseCategory.Transportation,
  'taxi': ExpenseCategory.Transportation,
  'bus': ExpenseCategory.Transportation,
  'train': ExpenseCategory.Transportation,
  'metro': ExpenseCategory.Transportation,
  'gas': ExpenseCategory.Transportation,
  'fuel': ExpenseCategory.Transportation,
  'car': ExpenseCategory.Transportation,
  
  // Healthcare
  'doctor': ExpenseCategory.Healthcare,
  'medical': ExpenseCategory.Healthcare,
  'pharmacy': ExpenseCategory.Healthcare,
  'health': ExpenseCategory.Healthcare,
  'dental': ExpenseCategory.Healthcare,
  'medicine': ExpenseCategory.Healthcare,
  
  // Entertainment
  'movie': ExpenseCategory.Entertainment,
  'netflix': ExpenseCategory.Entertainment,
  'spotify': ExpenseCategory.Entertainment,
  'hbo': ExpenseCategory.Entertainment,
  'disney': ExpenseCategory.Entertainment,
  'cinema': ExpenseCategory.Entertainment,
  'game': ExpenseCategory.Entertainment,
  'subscription': ExpenseCategory.Entertainment,
  
  // Shopping
  'clothes': ExpenseCategory.Shopping,
  'amazon': ExpenseCategory.Shopping,
  'shopping': ExpenseCategory.Shopping,
  'store': ExpenseCategory.Shopping,
  'mall': ExpenseCategory.Shopping,
  
  // Utilities
  'electric': ExpenseCategory.Utilities,
  'water': ExpenseCategory.Utilities,
  'internet': ExpenseCategory.Utilities,
  'phone': ExpenseCategory.Utilities,
  'wifi': ExpenseCategory.Utilities,
  'bill': ExpenseCategory.Utilities,
  'utility': ExpenseCategory.Utilities,
  
  // Education
  'school': ExpenseCategory.Education,
  'course': ExpenseCategory.Education,
  'books': ExpenseCategory.Education,
  'tuition': ExpenseCategory.Education,
  'class': ExpenseCategory.Education,
  'education': ExpenseCategory.Education,
  'training': ExpenseCategory.Education,
  
  // Travel
  'flight': ExpenseCategory.Travel,
  'hotel': ExpenseCategory.Travel,
  'vacation': ExpenseCategory.Travel,
  'airbnb': ExpenseCategory.Travel,
  'trip': ExpenseCategory.Travel,
  'travel': ExpenseCategory.Travel,
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