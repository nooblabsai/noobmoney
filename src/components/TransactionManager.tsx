import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Transaction, RecurringTransaction } from '@/types/transactions';
import { useLanguage } from '@/contexts/LanguageContext';
import ExpenseForm from './ExpenseForm';
import RecurringTransactions from './RecurringTransactions';

interface TransactionManagerProps {
  onAddTransaction: (transaction: Transaction) => void;
  onAddRecurringTransaction: (transaction: RecurringTransaction) => void;
  onDeleteTransaction: (id: string, isRecurring: boolean) => void;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({
  onAddTransaction,
  onAddRecurringTransaction,
  onDeleteTransaction,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleAddTransaction = (amount: number, description: string, isIncome: boolean, date: Date) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(),
      amount,
      description,
      isIncome,
      date,
    };
    onAddTransaction(newTransaction);
    
    toast({
      title: isIncome ? t('income.added') : t('expense.added'),
      description: `${description}: €${amount.toFixed(2)}`,
    });
  };

  const handleAddRecurringTransaction = (transaction: Omit<RecurringTransaction, 'id'>) => {
    const newTransaction: RecurringTransaction = {
      ...transaction,
      id: Math.random().toString(),
    };
    onAddRecurringTransaction(newTransaction);
    
    toast({
      title: t('recurring.added'),
      description: `${transaction.description}: €${transaction.amount.toFixed(2)}`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('add.transaction')}</h2>
        <ExpenseForm onSubmit={handleAddTransaction} />
      </div>
      <div>
        <RecurringTransactions
          onAdd={handleAddRecurringTransaction}
          transactions={[]}
          onDelete={onDeleteTransaction}
        />
      </div>
    </div>
  );
};

export default TransactionManager;