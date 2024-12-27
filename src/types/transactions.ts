export interface Transaction {
  id: string;
  amount: number;
  description: string;
  isIncome: boolean;
  date: Date;
}

export interface RecurringTransaction extends Transaction {
  startDate: Date;
}