import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Transaction, RecurringTransaction } from '@/types/transactions';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExpenseCategory } from '@/types/categories';
import ExpenseForm from './ExpenseForm';
import RecurringTransactions from './RecurringTransactions';
import FirstTimeUserDialog from './FirstTimeUserDialog';
import OpenAIKeyButton from './OpenAIKeyButton';

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
  const [showFirstTimeDialog, setShowFirstTimeDialog] = useState(!localStorage.getItem('hasCompletedOnboarding'));

  const handleAddTransaction = (amount: number, description: string, isIncome: boolean, date: Date, category?: ExpenseCategory) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(),
      amount,
      description,
      isIncome,
      date,
      category,
    };
    onAddTransaction(newTransaction);
    
    toast({
      title: isIncome ? t('income.added') : t('expense.added'),
      description: `${description}: €${amount.toFixed(2)}`,
    });
  };

  const handleAddRecurringTransaction = (transaction: Omit<RecurringTransaction, 'id' | 'date'>) => {
    const newTransaction: RecurringTransaction = {
      ...transaction,
      id: Math.random().toString(),
      date: transaction.startDate,
    };
    onAddRecurringTransaction(newTransaction);
    
    toast({
      title: t('recurring.added'),
      description: `${transaction.description}: €${transaction.amount.toFixed(2)}`,
    });
  };

  const handleFirstTimeComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowFirstTimeDialog(false);
  };

  return (
    <>
      <FirstTimeUserDialog
        isOpen={showFirstTimeDialog}
        onClose={() => setShowFirstTimeDialog(false)}
        onComplete={handleFirstTimeComplete}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t('add.transaction')}</h2>
            <OpenAIKeyButton />
          </div>
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
    </>
  );
};

export default TransactionManager;