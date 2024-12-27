import React from 'react';
import TransactionManager from '@/components/TransactionManager';
import RunwayChart from '@/components/RunwayChart';
import TransactionHistory from '@/components/TransactionHistory';
import MonthlyStats from '@/components/MonthlyStats';
import FinancialAnalysis from '@/components/FinancialAnalysis';
import LanguageMenu from '@/components/LanguageMenu';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Transaction, RecurringTransaction } from '@/types/transactions';

const Index = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = React.useState('0');
  const [bankBalance, setBankBalance] = React.useState(() => {
    const saved = localStorage.getItem('bankBalance');
    return saved ? parseFloat(saved) : 0;
  });

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

  React.useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  React.useEffect(() => {
    localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions));
  }, [recurringTransactions]);

  React.useEffect(() => {
    localStorage.setItem('bankBalance', bankBalance.toString());
  }, [bankBalance]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
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
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: t('transaction.deleted'),
      });
    }
  };

  const handleReset = () => {
    localStorage.clear();
    setTransactions([]);
    setRecurringTransactions([]);
    setBankBalance(0);
    toast({
      title: t('reset.complete'),
      description: t('data.cleared'),
    });
  };

  const calculateRunway = () => {
    const data = [];
    const currentDate = new Date();
    let runningBalance = bankBalance;
    
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + i + 1, 0);

      // Calculate recurring transactions for this month
      const monthlyRecurring = recurringTransactions
        .filter(t => new Date(t.startDate) <= monthEnd)
        .reduce((sum, t) => sum + (t.isIncome ? t.amount : -t.amount), 0);

      // Calculate one-time transactions for this month
      const monthlyOneTime = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= monthStart && transactionDate <= monthEnd;
        })
        .reduce((sum, t) => sum + (t.isIncome ? t.amount : -t.amount), 0);

      runningBalance += monthlyRecurring + monthlyOneTime;

      data.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        balance: runningBalance,
      });
    }

    return data;
  };

  const mappedTransactionsForHistory = [
    ...transactions.map(t => ({ ...t, isRecurring: false })),
    ...recurringTransactions.map(rt => ({
      ...rt,
      date: rt.startDate,
      isRecurring: true
    }))
  ] as Transaction[];

  const mappedRecurringTransactionsForStats = recurringTransactions.map(rt => ({
    ...rt,
    date: rt.startDate
  })) as Transaction[];

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

      <div className="mb-8">
        <Label htmlFor="bankBalance">{t('current.bank.balance')}</Label>
        <Input
          id="bankBalance"
          type="number"
          value={bankBalance}
          onChange={(e) => setBankBalance(parseFloat(e.target.value) || 0)}
          className="max-w-xs"
        />
      </div>
      
      <TransactionManager
        onAddTransaction={handleAddTransaction}
        onAddRecurringTransaction={handleAddRecurringTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />

      <MonthlyStats
        transactions={transactions}
        recurringTransactions={mappedRecurringTransactionsForStats}
        selectedMonth={selectedMonth}
        onMonthSelect={setSelectedMonth}
      />

      <TransactionHistory
        transactions={mappedTransactionsForHistory}
        recurringTransactions={[]}
        onDeleteTransaction={handleDeleteTransaction}
      />

      <FinancialAnalysis
        transactions={transactions}
        recurringTransactions={recurringTransactions}
        currentBalance={bankBalance}
      />

      <RunwayChart data={calculateRunway()} />
    </div>
  );
};

export default Index;