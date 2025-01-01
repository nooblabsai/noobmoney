import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, Repeat, Trash2, Tag } from 'lucide-react';
import { format, addMonths, isSameMonth } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { Transaction, RecurringTransaction } from '@/types/transactions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/hooks/useTransactions';
import { updateTransactionCategories } from '@/services/supabaseService';
import { supabase } from '@/lib/supabaseClient';

interface TransactionHistoryProps {
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  onDeleteTransaction: (id: string, isRecurring: boolean) => void;
  selectedMonth: string;
}

interface CombinedTransaction extends Transaction {
  isRecurring: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  recurringTransactions,
  onDeleteTransaction,
  selectedMonth,
}) => {
  const { t } = useLanguage();
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const selectedDate = addMonths(new Date(), parseInt(selectedMonth));

  const filteredTransactions = showAllTransactions 
    ? transactions 
    : transactions.filter(t => isSameMonth(new Date(t.date), selectedDate));

  const filteredRecurringTransactions = showAllTransactions
    ? recurringTransactions
    : recurringTransactions.filter(t => isSameMonth(new Date(t.startDate), selectedDate));

  const allTransactions: CombinedTransaction[] = [
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
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 mb-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {transaction.isIncome ? (
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-red-500" />
                  )}
                  {transaction.isRecurring && (
                    <Repeat className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-500">
                      {format(new Date(transaction.date), 'PPP')}
                    </p>
                    {!transaction.isIncome && transaction.category && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {t(transaction.category)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-medium ${
                  transaction.isIncome ? 'text-green-600' : 'text-red-600'
                }`}>
                  €{transaction.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => onDeleteTransaction(transaction.id, transaction.isRecurring)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={t('delete')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </Card>
  );
};

export default TransactionHistory;

