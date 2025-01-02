import { Transaction, RecurringTransaction } from '@/types/transactions';

export const calculateRunway = (
  includeInitialBalances: boolean,
  bankBalance: string,
  debtBalance: string,
  transactions: Transaction[] = [], // Add default empty array
  recurringTransactions: RecurringTransaction[] = [] // Add default empty array
) => {
  const data = [];
  const currentDate = new Date();
  let runningBalance = includeInitialBalances ? parseFloat(bankBalance) - parseFloat(debtBalance) : 0;
  
  // Start from 6 months ago
  for (let i = -6; i < 12; i++) {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + i + 1, 0);

    // Calculate recurring transactions
    const monthlyRecurringIncome = recurringTransactions
      .filter(t => t.isIncome && new Date(t.startDate) <= monthEnd)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyRecurringExpenses = recurringTransactions
      .filter(t => !t.isIncome && new Date(t.startDate) <= monthEnd)
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate one-time transactions that fall within this month
    const monthlyOneTimeIncome = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.isIncome && 
               transactionDate.getFullYear() === monthStart.getFullYear() &&
               transactionDate.getMonth() === monthStart.getMonth();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyOneTimeExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return !t.isIncome && 
               transactionDate.getFullYear() === monthStart.getFullYear() &&
               transactionDate.getMonth() === monthStart.getMonth();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Total income and expenses for the month
    const totalIncome = monthlyRecurringIncome + monthlyOneTimeIncome;
    const totalExpenses = monthlyRecurringExpenses + monthlyOneTimeExpenses;
    
    // Update running balance
    runningBalance += (totalIncome - totalExpenses);

    data.push({
      month: monthStart.toLocaleString('default', { month: 'short' }),
      balance: Number(runningBalance.toFixed(2)),
      income: Number(totalIncome.toFixed(2)),
      expenses: Number(totalExpenses.toFixed(2)),
    });
  }

  return data;
};