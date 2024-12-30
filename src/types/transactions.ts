import { ExpenseCategory } from './categories';
import { IncomeCategory } from './incomeCategories';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  isIncome: boolean;
  date: Date;
  category?: ExpenseCategory | IncomeCategory;
}

export interface RecurringTransaction extends Transaction {
  startDate: Date;
}