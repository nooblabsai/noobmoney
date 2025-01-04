import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Transaction, RecurringTransaction } from '@/types/transactions';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExpenseCategory } from '@/types/categories';
import ExpenseForm from './ExpenseForm';
import RecurringTransactions from './RecurringTransactions';
import FirstTimeUserDialog from './FirstTimeUserDialog';

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
    
    // Dispatch event for sync status
    window.dispatchEvent(new Event('transactionAdded'));
    
    toast({
      title: isIncome ? t('income.added') : t('expense.added'),
      description: `${description}: €${amount.toFixed(2)}`,
    });
  };

  const handleFirstTimeComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowFirstTimeDialog(false);
  };

  const handleAddRecurringTransaction = (transaction: Omit<RecurringTransaction, 'id' | 'date'>) => {
    const newTransaction: RecurringTransaction = {
      ...transaction,
      id: Math.random().toString(),
      date: new Date(),
    };
    onAddRecurringTransaction(newTransaction);
    
    // Dispatch event for sync status
    window.dispatchEvent(new Event('transactionAdded'));
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
    </>
  );
};

export default TransactionManager;