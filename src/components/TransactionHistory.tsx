import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, Repeat, Trash2 } from 'lucide-react';
import { format, addMonths, isSameMonth } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { Transaction, RecurringTransaction } from '@/types/transactions';

interface TransactionHistoryProps {
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  onDeleteTransaction: (id: string, isRecurring: boolean) => void;
  selectedMonth: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  recurringTransactions,
  onDeleteTransaction,
  selectedMonth,
}) => {
  const { t } = useLanguage();

  const selectedDate = addMonths(new Date(), parseInt(selectedMonth));

  // Filter one-time transactions for the selected month
  const filteredTransactions = transactions.filter(t => 
    isSameMonth(new Date(t.date), selectedDate)
  );

  // Filter recurring transactions that started before or during the selected month
  const filteredRecurringTransactions = recurringTransactions.filter(t => 
    new Date(t.startDate) <= selectedDate
  );

  // Combine and sort all transactions
  const allTransactions = [
    ...filteredTransactions.map(t => ({ ...t, isRecurring: false })),
    ...filteredRecurringTransactions.map(t => ({ 
      id: t.id,
      amount: t.amount,
      description: t.description,
      isIncome: t.isIncome,
      date: t.startDate,
      isRecurring: true 
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (date: Date) => {
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date:', date);
        return 'Invalid date';
      }
      return format(dateObj, 'PPP');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {t('transaction.history')} - {format(selectedDate, 'MMMM yyyy')}
      </h2>
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        {allTransactions.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            {t('no.transactions')}
          </div>
        ) : (
          allTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 mb-2 bg-gray-50 rounded-lg"
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
                  <p className="text-sm text-gray-500">
                    {transaction.isRecurring ? t('recurring.from') : ''} {formatDate(transaction.date)}
                  </p>
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