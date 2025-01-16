import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { format, addMonths, isSameMonth } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { Transaction, RecurringTransaction } from '@/types/transactions';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks/useTransactions';
import { useToast } from '@/components/ui/use-toast';
import TransactionItem from './transaction/TransactionItem';
import { useNavigate, useLocation } from 'react-router-dom';

interface TransactionHistoryProps {
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  onDeleteTransaction: (id: string, isRecurring: boolean) => void;
  selectedMonth: string;
  onTransactionsUpdate: (transactions: Transaction[], recurringTransactions: RecurringTransaction[]) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions: initialTransactions,
  recurringTransactions: initialRecurringTransactions,
  onDeleteTransaction,
  selectedMonth,
  onTransactionsUpdate,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expenses'>('all');
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
  ]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .filter(t => {
    if (filter === 'all') return true;
    if (filter === 'income') return t.isIncome;
    return !t.isIncome;
  });

  const handleEditTransaction = async (id: string, newAmount: number, isRecurring: boolean) => {
    try {
      let updatedTransactions, updatedRecurringTransactions;
      
      if (isRecurring) {
        updatedRecurringTransactions = localRecurringTransactions.map(t => 
          t.id === id ? { ...t, amount: newAmount } : t
        );
        setLocalRecurringTransactions(updatedRecurringTransactions);
        setRecurringTransactions(updatedRecurringTransactions);
        localStorage.setItem('recurringTransactions', JSON.stringify(updatedRecurringTransactions));
      } else {
        updatedTransactions = localTransactions.map(t => 
          t.id === id ? { ...t, amount: newAmount } : t
        );
        setLocalTransactions(updatedTransactions);
        setTransactions(updatedTransactions);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      }
      
      onTransactionsUpdate(
        updatedTransactions || localTransactions,
        updatedRecurringTransactions || localRecurringTransactions
      );

      window.dispatchEvent(new Event('transactionEdited'));
      
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

  return (
    <Card className="p-6 mb-8">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
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
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            {t('all')}
          </Button>
          <Button
            variant={filter === 'income' ? 'default' : 'outline'}
            onClick={() => setFilter('income')}
          >
            {t('income')}
          </Button>
          <Button
            variant={filter === 'expenses' ? 'default' : 'outline'}
            onClick={() => setFilter('expenses')}
          >
            {t('expenses')}
          </Button>
          {location.pathname !== '/transactions' && (
            <Button
              variant="outline"
              className="ml-auto"
              onClick={() => navigate('/transactions')}
            >
              {t('view.all.transactions')}
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-[300px] w-full rounded-md border p-4 mt-4">
        {allTransactions.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            {t('no.transactions')}
          </div>
        ) : (
          allTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={(id, isRecurring) => {
                onDeleteTransaction(id, isRecurring);
                window.dispatchEvent(new Event('transactionDeleted'));
              }}
              onEdit={handleEditTransaction}
            />
          ))
        )}
      </ScrollArea>
    </Card>
  );
};

export default TransactionHistory;