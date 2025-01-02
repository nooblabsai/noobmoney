import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { format, addMonths, isSameMonth } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { Transaction, RecurringTransaction } from '@/types/transactions';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks/useTransactions';
import { updateTransactionCategories } from '@/services/supabaseService';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import TransactionItem from './transaction/TransactionItem';

interface TransactionHistoryProps {
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  onDeleteTransaction: (id: string, isRecurring: boolean) => void;
  selectedMonth: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions: initialTransactions,
  recurringTransactions: initialRecurringTransactions,
  onDeleteTransaction,
  selectedMonth,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const { setTransactions, setRecurringTransactions } = useTransactions();
  const [localTransactions, setLocalTransactions] = useState(initialTransactions);
  const [localRecurringTransactions, setLocalRecurringTransactions] = useState(initialRecurringTransactions);

  useEffect(() => {
    setLocalTransactions(initialTransactions);
    setLocalRecurringTransactions(initialRecurringTransactions);
  }, [initialTransactions, initialRecurringTransactions]);

  const selectedDate = addMonths(new Date(), parseInt(selectedMonth));

  const filteredTransactions = showAllTransactions 
    ? localTransactions 
    : localTransactions.filter(t => isSameMonth(new Date(t.date), selectedDate));

  const filteredRecurringTransactions = showAllTransactions
    ? localRecurringTransactions
    : localRecurringTransactions.filter(t => isSameMonth(new Date(t.startDate), selectedDate));

  const allTransactions = [
    ...filteredTransactions.map(t => ({ ...t, isRecurring: false })),
    ...filteredRecurringTransactions.map(t => ({ 
      id: t.id,
      amount: t.amount,
      description: t.description,
      isIncome: t.isIncome,
      date: t.startDate,
      category: t.category,
      isRecurring: true 
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEditTransaction = async (id: string, newAmount: number, isRecurring: boolean) => {
    try {
      if (isRecurring) {
        const updatedRecurringTransactions = localRecurringTransactions.map(t => 
          t.id === id ? { ...t, amount: newAmount } : t
        );
        setLocalRecurringTransactions(updatedRecurringTransactions);
        setRecurringTransactions(updatedRecurringTransactions);
        localStorage.setItem('recurringTransactions', JSON.stringify(updatedRecurringTransactions));
      } else {
        const updatedTransactions = localTransactions.map(t => 
          t.id === id ? { ...t, amount: newAmount } : t
        );
        setLocalTransactions(updatedTransactions);
        setTransactions(updatedTransactions);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      }
      
      toast({
        title: t('success'),
        description: t('amount.updated'),
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: t('error'),
        description: t('error'),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const updateCategories = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        await updateTransactionCategories(session.user.id);
      }
    };
    updateCategories();
  }, []);

  return (
    <Card className="p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {t('transaction.history')} - {showAllTransactions ? t('all.time') : format(selectedDate, 'MMMM yyyy')}
        </h2>
        <Button
          variant="outline"
          onClick={() => setShowAllTransactions(!showAllTransactions)}
        >
          {showAllTransactions ? t('show.selected.month') : t('show.all.transactions')}
        </Button>
      </div>
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        {allTransactions.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            {t('no.transactions')}
          </div>
        ) : (
          allTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={onDeleteTransaction}
              onEdit={handleEditTransaction}
            />
          ))
        )}
      </ScrollArea>
    </Card>
  );
};

export default TransactionHistory;