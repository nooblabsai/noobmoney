import { useState, useEffect } from 'react';
import { Transaction, RecurringTransaction } from '@/types/transactions';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseTransactionsProps {
  onDataChange?: () => void;
}

export const useTransactions = ({ onDataChange }: UseTransactionsProps = {}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }));
    }
    return [];
  });

  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(() => {
    const saved = localStorage.getItem('recurringTransactions');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((t: any) => ({
        ...t,
        startDate: new Date(t.startDate)
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    onDataChange?.();
    
    // Dispatch event for data changes
    window.dispatchEvent(new CustomEvent('transactionAdded'));
  }, [transactions, onDataChange]);

  useEffect(() => {
    localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions));
    onDataChange?.();
    
    // Dispatch event for data changes
    window.dispatchEvent(new CustomEvent('transactionAdded'));
  }, [recurringTransactions, onDataChange]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  const handleAddRecurringTransaction = (transaction: RecurringTransaction) => {
    setRecurringTransactions(prev => [...prev, transaction]);
  };

  const handleDeleteTransaction = (id: string, isRecurring: boolean) => {
    if (isRecurring) {
      setRecurringTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: t('recurring.deleted'),
      });
    } else {
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: t('transaction.deleted'),
      });
    }
  };

  return {
    transactions,
    recurringTransactions,
    handleAddTransaction,
    handleAddRecurringTransaction,
    handleDeleteTransaction,
    setTransactions,
    setRecurringTransactions,
  };
};