import React from 'react';
import LoadDataButton from '@/components/LoadDataButton';
import { Button } from '@/components/ui/button';
import { Transaction, RecurringTransaction } from '@/types/transactions';

interface DataManagementSectionProps {
  onDataLoaded: (
    transactions: Transaction[],
    recurringTransactions: RecurringTransaction[],
    bankBalance: string,
    debtBalance: string
  ) => void;
  handleExportPDF: () => void;
}

const DataManagementSection: React.FC<DataManagementSectionProps> = ({
  onDataLoaded,
  handleExportPDF,
}) => {
  return (
    <div className="flex gap-4 mb-8">
      <LoadDataButton onDataLoaded={onDataLoaded} />
      <Button variant="outline" onClick={handleExportPDF}>
        Export PDF
      </Button>
    </div>
  );
};

export default DataManagementSection;