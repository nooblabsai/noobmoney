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
import { Trash2, Wallet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';

const Index = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = React.useState('0');
  const [bankBalance, setBankBalance] = React.useState(() => {
    const saved = localStorage.getItem('bankBalance');
    return saved ? parseFloat(saved) : 0;
  });

  const {
    transactions,
    recurringTransactions,
    handleAddTransaction,
    handleAddRecurringTransaction,
    handleDeleteTransaction,
  } = useTransactions();

  React.useEffect(() => {
    localStorage.setItem('bankBalance', bankBalance.toString());
  }, [bankBalance]);

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
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

      const monthlyRecurring = recurringTransactions
        .filter(t => new Date(t.startDate) <= monthEnd)
        .reduce((sum, t) => sum + (t.isIncome ? t.amount : -t.amount), 0);

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

      <Card className="p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="h-6 w-6 text-primary" />
          <Label htmlFor="bankBalance" className="text-xl font-semibold">{t('current.bank.balance')}</Label>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold text-primary">€</span>
          <Input
            id="bankBalance"
            type="number"
            value={bankBalance}
            onChange={(e) => setBankBalance(parseFloat(e.target.value) || 0)}
            className="text-4xl font-bold h-16 max-w-xs"
          />
        </div>
      </Card>
      
      <TransactionManager
        onAddTransaction={handleAddTransaction}
        onAddRecurringTransaction={handleAddRecurringTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />

      <MonthlyStats
        transactions={transactions}
        recurringTransactions={recurringTransactions}
        selectedMonth={selectedMonth}
        onMonthSelect={setSelectedMonth}
      />

      <TransactionHistory
        transactions={transactions}
        recurringTransactions={recurringTransactions}
        onDeleteTransaction={handleDeleteTransaction}
      />

      <RunwayChart data={calculateRunway()} />

      <FinancialAnalysis
        transactions={transactions}
        recurringTransactions={recurringTransactions}
        currentBalance={bankBalance}
      />
    </div>
  );
};

export default Index;