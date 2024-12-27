import React from 'react';
import { Button } from '@/components/ui/button';

interface RecurringTransaction {
  id: string;
  amount: number;
  description: string;
  isIncome: boolean;
}

interface RecurringTransactionItemProps {
  transaction: RecurringTransaction;
  onDelete: (id: string, isRecurring: boolean) => void;
}

const RecurringTransactionItem: React.FC<RecurringTransactionItemProps> = ({
  transaction,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <span className="font-medium">{transaction.description}</span>
        <span className={`ml-2 ${transaction.isIncome ? 'text-green-600' : 'text-red-600'}`}>
          €{transaction.amount.toFixed(2)}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(transaction.id, true)}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </Button>
    </div>
  );
};

export default RecurringTransactionItem;