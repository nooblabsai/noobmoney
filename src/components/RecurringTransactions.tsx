import React from 'react';
import { Card } from '@/components/ui/card';
import { Repeat } from 'lucide-react';
import RecurringTransactionForm from './recurring/RecurringTransactionForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExpenseCategory } from '@/types/categories';
import { autoTagExpense } from '@/services/categoryService';

interface RecurringTransaction {
  id: string;
  amount: number;
  description: string;
  isIncome: boolean;
  startDate: Date;
  category?: ExpenseCategory;
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
  const [startDate, setStartDate] = React.useState<Date>(new Date());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    let category: ExpenseCategory | undefined;
    if (!isIncome) {
      category = await autoTagExpense(description);
    }

    onAdd({
      amount: parseFloat(amount),
      description,
      isIncome,
      startDate,
      category,
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
        startDate={startDate}
        setStartDate={setStartDate}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

export default RecurringTransactions;