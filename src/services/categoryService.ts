import { ExpenseCategory } from '@/types/categories';

const keywordMap: Record<string, ExpenseCategory> = {
  // Housing related
  'rent': ExpenseCategory.Housing,
  'mortgage': ExpenseCategory.Housing,
  'apartment': ExpenseCategory.Housing,
  'house': ExpenseCategory.Housing,
  'maintenance': ExpenseCategory.Housing,
  'repair': ExpenseCategory.Housing,
  'ενοίκιο': ExpenseCategory.Housing,
  'σπίτι': ExpenseCategory.Housing,
  'διαμέρισμα': ExpenseCategory.Housing,
  'συντήρηση': ExpenseCategory.Housing,
  'επισκευή': ExpenseCategory.Housing,
  
  // Food related
  'food': ExpenseCategory.Food,
  'grocery': ExpenseCategory.Food,
  'groceries': ExpenseCategory.Food,
  'restaurant': ExpenseCategory.Food,
  'dining': ExpenseCategory.Food,
  'meal': ExpenseCategory.Food,
  'lunch': ExpenseCategory.Food,
  'dinner': ExpenseCategory.Food,
  'φαγητό': ExpenseCategory.Food,
  'σούπερ μάρκετ': ExpenseCategory.Food,
  'εστιατόριο': ExpenseCategory.Food,
  'γεύμα': ExpenseCategory.Food,
  'μεσημεριανό': ExpenseCategory.Food,
  'βραδινό': ExpenseCategory.Food,
  
  // Transportation
  'uber': ExpenseCategory.Transportation,
  'taxi': ExpenseCategory.Transportation,
  'bus': ExpenseCategory.Transportation,
  'train': ExpenseCategory.Transportation,
  'metro': ExpenseCategory.Transportation,
  'gas': ExpenseCategory.Transportation,
  'fuel': ExpenseCategory.Transportation,
  'car': ExpenseCategory.Transportation,
  'ταξί': ExpenseCategory.Transportation,
  'λεωφορείο': ExpenseCategory.Transportation,
  'τρένο': ExpenseCategory.Transportation,
  'μετρό': ExpenseCategory.Transportation,
  'βενζίνη': ExpenseCategory.Transportation,
  'καύσιμα': ExpenseCategory.Transportation,
  'αυτοκίνητο': ExpenseCategory.Transportation,
  
  // Healthcare
  'doctor': ExpenseCategory.Healthcare,
  'medical': ExpenseCategory.Healthcare,
  'pharmacy': ExpenseCategory.Healthcare,
  'health': ExpenseCategory.Healthcare,
  'dental': ExpenseCategory.Healthcare,
  'medicine': ExpenseCategory.Healthcare,
  'γιατρός': ExpenseCategory.Healthcare,
  'ιατρικά': ExpenseCategory.Healthcare,
  'φαρμακείο': ExpenseCategory.Healthcare,
  'υγεία': ExpenseCategory.Healthcare,
  'οδοντίατρος': ExpenseCategory.Healthcare,
  'φάρμακα': ExpenseCategory.Healthcare,
  
  // Entertainment
  'movie': ExpenseCategory.Entertainment,
  'netflix': ExpenseCategory.Entertainment,
  'spotify': ExpenseCategory.Entertainment,
  'hbo': ExpenseCategory.Entertainment,
  'disney': ExpenseCategory.Entertainment,
  'cinema': ExpenseCategory.Entertainment,
  'game': ExpenseCategory.Entertainment,
  'subscription': ExpenseCategory.Entertainment,
  'ταινία': ExpenseCategory.Entertainment,
  'σινεμά': ExpenseCategory.Entertainment,
  'παιχνίδι': ExpenseCategory.Entertainment,
  'συνδρομή': ExpenseCategory.Entertainment,
  
  // Shopping
  'clothes': ExpenseCategory.Shopping,
  'amazon': ExpenseCategory.Shopping,
  'shopping': ExpenseCategory.Shopping,
  'store': ExpenseCategory.Shopping,
  'mall': ExpenseCategory.Shopping,
  'ρούχα': ExpenseCategory.Shopping,
  'αγορές': ExpenseCategory.Shopping,
  'κατάστημα': ExpenseCategory.Shopping,
  'εμπορικό': ExpenseCategory.Shopping,
  
  // Utilities
  'electric': ExpenseCategory.Utilities,
  'water': ExpenseCategory.Utilities,
  'internet': ExpenseCategory.Utilities,
  'phone': ExpenseCategory.Utilities,
  'wifi': ExpenseCategory.Utilities,
  'bill': ExpenseCategory.Utilities,
  'utility': ExpenseCategory.Utilities,
  'ρεύμα': ExpenseCategory.Utilities,
  'νερό': ExpenseCategory.Utilities,
  'τηλέφωνο': ExpenseCategory.Utilities,
  'λογαριασμός': ExpenseCategory.Utilities,
  
  // Education
  'school': ExpenseCategory.Education,
  'course': ExpenseCategory.Education,
  'books': ExpenseCategory.Education,
  'tuition': ExpenseCategory.Education,
  'class': ExpenseCategory.Education,
  'education': ExpenseCategory.Education,
  'training': ExpenseCategory.Education,
  'σχολείο': ExpenseCategory.Education,
  'μάθημα': ExpenseCategory.Education,
  'βιβλία': ExpenseCategory.Education,
  'δίδακτρα': ExpenseCategory.Education,
  'εκπαίδευση': ExpenseCategory.Education,
  
  // Travel
  'flight': ExpenseCategory.Travel,
  'hotel': ExpenseCategory.Travel,
  'vacation': ExpenseCategory.Travel,
  'airbnb': ExpenseCategory.Travel,
  'trip': ExpenseCategory.Travel,
  'travel': ExpenseCategory.Travel,
  'πτήση': ExpenseCategory.Travel,
  'ξενοδοχείο': ExpenseCategory.Travel,
  'διακοπές': ExpenseCategory.Travel,
  'ταξίδι': ExpenseCategory.Travel,
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