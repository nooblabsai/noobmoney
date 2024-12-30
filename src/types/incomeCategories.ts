export enum IncomeCategory {
  Salary = 'salary',
  Freelance = 'freelance',
  Investments = 'investments',
  Rent = 'rent',
  Business = 'business',
  CustomerPayment = 'customer.payment',
  Refund = 'refund',
  Gift = 'gift',
  Other = 'other'
}

export const getIncomeCategoryColor = (category: IncomeCategory): string => {
  const colors: Record<IncomeCategory, string> = {
    [IncomeCategory.Salary]: '#4CAF50',
    [IncomeCategory.Freelance]: '#8BC34A',
    [IncomeCategory.Investments]: '#009688',
    [IncomeCategory.Rent]: '#00BCD4',
    [IncomeCategory.Business]: '#03A9F4',
    [IncomeCategory.CustomerPayment]: '#2196F3',
    [IncomeCategory.Refund]: '#3F51B5',
    [IncomeCategory.Gift]: '#9C27B0',
    [IncomeCategory.Other]: '#607D8B'
  };
  return colors[category];
};