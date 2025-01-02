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
  const runwayData = calculateRunway(
    parseFloat(bankBalance),
    parseFloat(debtBalance),
    transactions,
    recurringTransactions
  );

  return (
    <div className="space-y-8">
      <RunwayChart
        data={runwayData}
        title={t('financial.runway')}
        showIncomeExpenses={true}
      />
      <ExpenseCategoriesChart
        transactions={[...transactions, ...recurringTransactions]}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default ChartsSection;