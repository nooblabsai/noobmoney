import { Transaction, RecurringTransaction } from '@/types/transactions';

export const useBalanceCalculations = (
  transactions: Transaction[],
  recurringTransactions: RecurringTransaction[],
  initialBankBalance: string,
  initialDebtBalance: string
) => {
  const calculateUpdatedBalances = () => {
    const transactionTotal = transactions.reduce((total, t) => {
      return total + (t.isIncome ? t.amount : -t.amount);
    }, 0);

    const recurringTotal = recurringTransactions.reduce((total, t) => {
      return total + (t.isIncome ? t.amount : -t.amount);
    }, 0);

    const totalChange = transactionTotal + recurringTotal;
    
    const updatedBankBalance = (parseFloat(initialBankBalance) + totalChange).toString();
    
    return {
      bankBalance: updatedBankBalance,
      debtBalance: initialDebtBalance // Debt balance remains unchanged as it's managed separately
    };
  };

  return { calculateUpdatedBalances };
};