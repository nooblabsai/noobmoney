import { Transaction, RecurringTransaction } from '@/types/transactions';

export const transformTransactionForDB = (transaction: Transaction | RecurringTransaction, userId: string) => ({
  id: transaction.id,
  amount: transaction.amount,
  description: transaction.description,
  is_income: transaction.isIncome,
  date: 'startDate' in transaction ? transaction.startDate : transaction.date,
  category: transaction.category || 'other',
  user_id: userId,
});

export const transformTransactionsForStorage = (transactions: (Transaction | RecurringTransaction)[], userId: string) => {
  return transactions.map(transaction => transformTransactionForDB(transaction, userId));
};

export const transformTransactionsFromStorage = (dbTransactions: any[]): (Transaction | RecurringTransaction)[] => {
  return dbTransactions.map(dbTransaction => ({
    id: dbTransaction.id,
    amount: dbTransaction.amount,
    description: dbTransaction.description,
    isIncome: dbTransaction.is_income,
    date: new Date(dbTransaction.date),
    category: dbTransaction.category,
    ...(dbTransaction.start_date && { startDate: new Date(dbTransaction.start_date) })
  }));
};