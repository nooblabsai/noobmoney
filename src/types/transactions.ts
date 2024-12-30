import { ExpenseCategory } from './categories';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  isIncome: boolean;
  date: Date;
  category?: ExpenseCategory;
}

export interface RecurringTransaction extends Transaction {
  startDate: Date;
}