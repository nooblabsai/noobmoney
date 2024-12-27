import React from 'react';
import { Card } from '@/components/ui/card';
import { Repeat } from 'lucide-react';
import RecurringTransactionForm from './recurring/RecurringTransactionForm';
import RecurringTransactionItem from './recurring/RecurringTransactionItem';
import { useLanguage } from '@/contexts/LanguageContext';

interface RecurringTransaction {
  id: string;
  amount: number;
  description: string;
  isIncome: boolean;
}

interface RecurringTransactionsProps {
  onAdd: (transaction: Omit<RecurringTransaction, 'id'>) => void;
  transactions: RecurringTransaction[];
  onDelete: (id: string, isRecurring: boolean) => void;
}

const RecurringTransactions: React.FC<RecurringTransactionsProps> = ({
  onAdd,
  transactions,
  onDelete,
}) => {
  const { t } = useLanguage();
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isIncome, setIsIncome] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    onAdd({
      amount: parseFloat(amount),
      description,
      isIncome,
    });
    setAmount('');
    setDescription('');
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <Repeat className="mr-2 h-5 w-5" />
        <h2 className="text-xl font-semibold">{t('recurring.transactions')}</h2>
      </div>
      
      <RecurringTransactionForm
        amount={amount}
        setAmount={setAmount}
        description={description}
        setDescription={setDescription}
        isIncome={isIncome}
        setIsIncome={setIsIncome}
        onSubmit={handleSubmit}
      />

      <div className="space-y-2">
        {transactions.map((transaction) => (
          <RecurringTransactionItem
            key={transaction.id}
            transaction={transaction}
            onDelete={onDelete}
          />
        ))}
      </div>
    </Card>
  );
};

export default RecurringTransactions;