import React from 'react';
import RunwayChart from '@/components/RunwayChart';
import ExpenseCategoriesChart from '@/components/ExpenseCategoriesChart';
import { calculateRunway } from '@/utils/runwayCalculations';
import { Transaction, RecurringTransaction } from '@/types/transactions';

interface ChartsSectionProps {
  transactions: Transaction[];
  selectedDate: Date;
  bankBalance: string;
  debtBalance: string;
  recurringTransactions: RecurringTransaction[];
  t: (key: string) => string;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  transactions,
  selectedDate,
  bankBalance,
  debtBalance,
  recurringTransactions,
  t,
}) => {
  const runwayDataWithInitialBalances = calculateRunway(
    true, // includeInitialBalances
    bankBalance,
    debtBalance,
    transactions,
    recurringTransactions
  );

  const runwayDataWithoutInitialBalances = calculateRunway(
    false, // includeInitialBalances
    bankBalance,
    debtBalance,
    transactions,
    recurringTransactions
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RunwayChart
          data={runwayDataWithInitialBalances}
          title={t('financial.runway.with.balances')}
          showIncomeExpenses={true}
        />
        <RunwayChart
          data={runwayDataWithoutInitialBalances}
          title={t('financial.runway.without.balances')}
          showIncomeExpenses={true}
        />
      </div>
      <ExpenseCategoriesChart
        transactions={[...transactions, ...recurringTransactions]}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default ChartsSection;