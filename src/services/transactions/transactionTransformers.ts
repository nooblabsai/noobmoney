import { Transaction, RecurringTransaction } from '@/types/transactions';

export const transformTransactionForDB = (transaction: Transaction, userId: string) => ({
  id: transaction.id,
  amount: transaction.amount,
  description: transaction.description,
  is_income: transaction.isIncome,
  date: transaction.date,
  category: transaction.category,
  user_id: userId,
});

export const transformRecurringTransactionForDB = (transaction: RecurringTransaction, userId: string) => ({
  id: transaction.id,
  amount: transaction.amount,
  description: transaction.description,
  is_income: transaction.isIncome,
  start_date: transaction.startDate,
  category: transaction.category,
  user_id: userId,
});

export const transformDBToTransaction = (dbTransaction: any): Transaction => ({
  id: dbTransaction.id,
  amount: dbTransaction.amount,
  description: dbTransaction.description,
  isIncome: dbTransaction.is_income,
  date: new Date(dbTransaction.date),
  category: dbTransaction.category,
});

export const transformDBToRecurringTransaction = (dbTransaction: any): RecurringTransaction => ({
  id: dbTransaction.id,
  amount: dbTransaction.amount,
  description: dbTransaction.description,
  isIncome: dbTransaction.is_income,
  date: new Date(dbTransaction.start_date),
  startDate: new Date(dbTransaction.start_date),
  category: dbTransaction.category,
});