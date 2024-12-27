export interface Transaction {
  id: string;
  amount: number;
  description: string;
  isIncome: boolean;
  date: Date;
}

export interface RecurringTransaction {
  id: string;
  amount: number;
  description: string;
  isIncome: boolean;
  startDate: Date;
}