import { Transaction, RecurringTransaction } from '@/types/transactions';

export const useBalanceCalculations = (
  transactions: Transaction[],
  recurringTransactions: RecurringTransaction[],
  initialBankBalance: string,
  initialDebtBalance: string
) => {
  const calculateUpdatedBalances = () => {
    return {
      bankBalance: initialBankBalance,
      debtBalance: initialDebtBalance
    };
  };

  return { calculateUpdatedBalances };
};