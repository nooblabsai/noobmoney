import React from 'react';
import LoadDataButton from '@/components/LoadDataButton';
import SaveDataButton from '@/components/SaveDataButton';
import { Button } from '@/components/ui/button';
import { Transaction, RecurringTransaction } from '@/types/transactions';

interface DataManagementSectionProps {
  onDataLoaded: (
    transactions: Transaction[],
    recurringTransactions: RecurringTransaction[],
    bankBalance: string,
    debtBalance: string
  ) => void;
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  bankBalance: string;
  debtBalance: string;
  onReset: () => void;
  handleExportPDF: () => void;
}

const DataManagementSection: React.FC<DataManagementSectionProps> = ({
  onDataLoaded,
  transactions,
  recurringTransactions,
  bankBalance,
  debtBalance,
  onReset,
  handleExportPDF,
}) => {
  return (
    <div className="flex gap-4 mb-8">
      <LoadDataButton onDataLoaded={onDataLoaded} />
      <SaveDataButton
        transactions={transactions}
        recurringTransactions={recurringTransactions}
        bankBalance={bankBalance}
        debtBalance={debtBalance}
      />
      <Button variant="outline" onClick={onReset}>
        Reset Data
      </Button>
      <Button variant="outline" onClick={handleExportPDF}>
        Export PDF
      </Button>
    </div>
  );
};

export default DataManagementSection;