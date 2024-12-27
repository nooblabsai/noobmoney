import React from 'react';
import TransactionManager from '@/components/TransactionManager';
import RunwayChart from '@/components/RunwayChart';
import TransactionHistory from '@/components/TransactionHistory';
import MonthlyStats from '@/components/MonthlyStats';
import FinancialAnalysis from '@/components/FinancialAnalysis';
import LanguageMenu from '@/components/LanguageMenu';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Transaction, RecurringTransaction } from '@/types/transactions';

const Index = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = React.useState('0');
  const [transactions, setTransactions] = React.useState<Transaction[]>(() => {
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

  const [recurringTransactions, setRecurringTransactions] = React.useState<RecurringTransaction[]>(() => {
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

  const [currentBalance, setCurrentBalance] = React.useState(() => {
    const saved = localStorage.getItem('currentBalance');
    return saved ? parseFloat(saved) : 0;
  });

  React.useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  React.useEffect(() => {
    localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions));
  }, [recurringTransactions]);

  React.useEffect(() => {
    localStorage.setItem('currentBalance', currentBalance.toString());
  }, [currentBalance]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
    setCurrentBalance(prev => prev + (transaction.isIncome ? transaction.amount : -transaction.amount));
  };

  const handleAddRecurringTransaction = (transaction: RecurringTransaction) => {
    setRecurringTransactions([...recurringTransactions, transaction]);
  };

  const handleDeleteTransaction = (id: string, isRecurring: boolean) => {
    if (isRecurring) {
      setRecurringTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: t('recurring.deleted'),
      });
    } else {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        setCurrentBalance(prev => prev - (transaction.isIncome ? transaction.amount : -transaction.amount));
        setTransactions(prev => prev.filter(t => t.id !== id));
        toast({
          title: t('transaction.deleted'),
        });
      }
    }
  };

  const handleReset = () => {
    localStorage.clear();
    setTransactions([]);
    setRecurringTransactions([]);
    setCurrentBalance(0);
    toast({
      title: t('reset.complete'),
      description: t('data.cleared'),
    });
  };

  const calculateRunway = () => {
    const monthlyRecurringIncome = recurringTransactions
      .filter(t => t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyRecurringExpenses = recurringTransactions
      .filter(t => !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyNet = monthlyRecurringIncome - monthlyRecurringExpenses;
    const data = [];

    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const monthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + i + 1, 0);

      const monthTransactions = transactions.filter(
        t => t.date >= monthStart && t.date <= monthEnd
      );
      
      const monthlyBalance = monthTransactions.reduce(
        (acc, t) => acc + (t.isIncome ? t.amount : -t.amount),
        monthlyNet
      );

      data.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        balance: monthlyBalance,
      });
    }

    return data;
  };

  const mappedRecurringTransactions = recurringTransactions.map(rt => ({
    ...rt,
    date: rt.startDate
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">{t('financial.runway.calculator')}</h1>
        <div className="flex items-center gap-4">
          <LanguageMenu />
          <Button variant="destructive" onClick={handleReset} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            {t('reset.data')}
          </Button>
        </div>
      </div>
      
      <TransactionManager
        onAddTransaction={handleAddTransaction}
        onAddRecurringTransaction={handleAddRecurringTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />

      <MonthlyStats
        transactions={transactions}
        recurringTransactions={mappedRecurringTransactions}
        selectedMonth={selectedMonth}
        onMonthSelect={setSelectedMonth}
      />

      <TransactionHistory
        transactions={transactions}
        recurringTransactions={mappedRecurringTransactions}
        onDeleteTransaction={handleDeleteTransaction}
      />

      <FinancialAnalysis
        transactions={transactions}
        recurringTransactions={recurringTransactions}
        currentBalance={currentBalance}
      />

      <RunwayChart data={calculateRunway()} />
    </div>
  );
};

export default Index;