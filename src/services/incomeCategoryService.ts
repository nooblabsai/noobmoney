import { IncomeCategory } from '@/types/incomeCategories';

const keywordMap: Record<string, IncomeCategory> = {
  // Salary related
  'salary': IncomeCategory.Salary,
  'wage': IncomeCategory.Salary,
  'paycheck': IncomeCategory.Salary,
  'pay': IncomeCategory.Salary,
  'μισθός': IncomeCategory.Salary,
  'αποδοχές': IncomeCategory.Salary,
  
  // Freelance related
  'freelance': IncomeCategory.Freelance,
  'contract': IncomeCategory.Freelance,
  'gig': IncomeCategory.Freelance,
  'project': IncomeCategory.Freelance,
  'φριλανς': IncomeCategory.Freelance,
  'έργο': IncomeCategory.Freelance,
  
  // Investments
  'dividend': IncomeCategory.Investments,
  'interest': IncomeCategory.Investments,
  'stock': IncomeCategory.Investments,
  'investment': IncomeCategory.Investments,
  'μέρισμα': IncomeCategory.Investments,
  'τόκος': IncomeCategory.Investments,
  'επένδυση': IncomeCategory.Investments,
  
  // Rent
  'rent': IncomeCategory.Rent,
  'lease': IncomeCategory.Rent,
  'tenant': IncomeCategory.Rent,
  'ενοίκιο': IncomeCategory.Rent,
  'μίσθωμα': IncomeCategory.Rent,
  'ενοικιαστής': IncomeCategory.Rent,
  
  // Business
  'sales': IncomeCategory.Business,
  'revenue': IncomeCategory.Business,
  'business': IncomeCategory.Business,
  'profit': IncomeCategory.Business,
  'πωλήσεις': IncomeCategory.Business,
  'έσοδα': IncomeCategory.Business,
  'επιχείρηση': IncomeCategory.Business,
  
  // Customer Payment
  'customer': IncomeCategory.CustomerPayment,
  'client': IncomeCategory.CustomerPayment,
  'payment': IncomeCategory.CustomerPayment,
  'invoice': IncomeCategory.CustomerPayment,
  'πελάτης': IncomeCategory.CustomerPayment,
  'τιμολόγιο': IncomeCategory.CustomerPayment,
  'πληρωμή': IncomeCategory.CustomerPayment,
  
  // Refund
  'refund': IncomeCategory.Refund,
  'return': IncomeCategory.Refund,
  'reimbursement': IncomeCategory.Refund,
  'επιστροφή': IncomeCategory.Refund,
  'αποζημίωση': IncomeCategory.Refund,
  
  // Gift
  'gift': IncomeCategory.Gift,
  'present': IncomeCategory.Gift,
  'donation': IncomeCategory.Gift,
  'δώρο': IncomeCategory.Gift,
  'δωρεά': IncomeCategory.Gift,
};

export const autoTagIncome = async (description: string): Promise<IncomeCategory> => {
  const lowerDesc = description.toLowerCase();
  
  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (lowerDesc.includes(keyword)) {
      console.log(`Categorized income "${description}" as ${category} based on keyword "${keyword}"`);
      return category;
    }
  }
  
  console.log(`No specific income category found for "${description}", defaulting to Other`);
  return IncomeCategory.Other;
};