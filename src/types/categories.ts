export enum ExpenseCategory {
  Housing = 'housing',
  Food = 'food',
  Transportation = 'transportation',
  Healthcare = 'healthcare',
  Entertainment = 'entertainment',
  Shopping = 'shopping',
  Utilities = 'utilities',
  Education = 'education',
  Travel = 'travel',
  Other = 'other'
}

export const getCategoryColor = (category: ExpenseCategory): string => {
  const colors: Record<ExpenseCategory, string> = {
    [ExpenseCategory.Housing]: '#FF6B6B',
    [ExpenseCategory.Food]: '#4ECDC4',
    [ExpenseCategory.Transportation]: '#45B7D1',
    [ExpenseCategory.Healthcare]: '#96CEB4',
    [ExpenseCategory.Entertainment]: '#FFEEAD',
    [ExpenseCategory.Shopping]: '#D4A5A5',
    [ExpenseCategory.Utilities]: '#9B9B9B',
    [ExpenseCategory.Education]: '#FFD93D',
    [ExpenseCategory.Travel]: '#6C5B7B',
    [ExpenseCategory.Other]: '#C8C8C8'
  };
  return colors[category];
};