import React from 'react';
import TransactionManager from '@/components/TransactionManager';
import RunwayChart from '@/components/RunwayChart';
import TransactionHistory from '@/components/TransactionHistory';
import MonthlyStats from '@/components/MonthlyStats';
import FinancialAnalysis from '@/components/FinancialAnalysis';
import LoadDataButton from '@/components/LoadDataButton';
import SaveDataButton from '@/components/SaveDataButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useTransactions } from '@/hooks/useTransactions';
import { BalanceSection } from '@/components/BalanceSection';
import { HeaderSection } from '@/components/HeaderSection';
import { exportToPDF } from '@/utils/pdfExport';
import ExpenseCategoriesChart from '@/components/ExpenseCategoriesChart';
import { ExpenseCategory } from '@/types/categories';
import { Transaction } from '@/types/transactions';

const Index = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = React.useState('0');
  const [bankBalance, setBankBalance] = React.useState(() => {
    const saved = localStorage.getItem('bankBalance');
    return saved ? saved : '0';
  });
  const [debtBalance, setDebtBalance] = React.useState(() => {
    const saved = localStorage.getItem('debtBalance');
    return saved ? saved : '0';
  });

  const {
    transactions,
    recurringTransactions,
    handleAddTransaction: addTransaction,
    handleAddRecurringTransaction,
    handleDeleteTransaction,
    setTransactions,
    setRecurringTransactions,
  } = useTransactions();

  React.useEffect(() => {
    localStorage.setItem('bankBalance', bankBalance);
  }, [bankBalance]);

  React.useEffect(() => {
    localStorage.setItem('debtBalance', debtBalance);
  }, [debtBalance]);

  const handleDataLoaded = (
    loadedTransactions: any[], 
    loadedRecurringTransactions: any[],
    loadedBankBalance: string,
    loadedDebtBalance: string
  ) => {
    setTransactions(loadedTransactions);
    setRecurringTransactions(loadedRecurringTransactions);
    setBankBalance(loadedBankBalance);
    setDebtBalance(loadedDebtBalance);
    toast({
      title: t('data.loaded'),
      description: t('data.loaded.success'),
    });
  };

  const handleExportPDF = async () => {
    const success = await exportToPDF('financial-report');
    if (success) {
      toast({
        title: t('pdf.exported'),
        description: t('pdf.exported.success'),
      });
    } else {
      toast({
        title: t('pdf.export.failed'),
        description: t('pdf.export.failed.description'),
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setTransactions([]);
    setRecurringTransactions([]);
    setBankBalance('0');
    setDebtBalance('0');
    localStorage.removeItem('bankBalance');
    localStorage.removeItem('debtBalance');
    toast({
      title: t('data.reset'),
      description: t('data.reset.success'),
    });
  };

  const calculateRunway = (includeInitialBalances: boolean) => {
    const data = [];
    const currentDate = new Date();
    let runningBalance = includeInitialBalances ? parseFloat(bankBalance) - parseFloat(debtBalance) : 0;
    
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + i + 1, 0);

      const monthlyRecurringIncome = recurringTransactions
        .filter(t => t.isIncome && new Date(t.startDate) <= monthEnd)
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyRecurringExpenses = recurringTransactions
        .filter(t => !t.isIncome && new Date(t.startDate) <= monthEnd)
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyOneTimeIncome = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return t.isIncome && transactionDate >= monthStart && transactionDate <= monthEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyOneTimeExpenses = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return !t.isIncome && transactionDate >= monthStart && transactionDate <= monthEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const totalIncome = monthlyRecurringIncome + monthlyOneTimeIncome;
      const totalExpenses = monthlyRecurringExpenses + monthlyOneTimeExpenses;
      runningBalance += totalIncome - totalExpenses;

      data.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        balance: runningBalance,
        income: totalIncome,
        expenses: totalExpenses,
      });
    }

    return data;
  };

  const handleAddTransaction = (transaction: Transaction) => {
    addTransaction(transaction);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <HeaderSection
        t={t}
        handleExportPDF={handleExportPDF}
        handleReset={handleReset}
      />

      <div id="financial-report">
        <BalanceSection
          bankBalance={bankBalance}
          setBankBalance={setBankBalance}
          debtBalance={debtBalance}
          setDebtBalance={setDebtBalance}
          t={t}
        />
      
        <div className="flex justify-end gap-4 mb-4">
          <LoadDataButton onDataLoaded={handleDataLoaded} />
          <SaveDataButton
            transactions={transactions}
            recurringTransactions={recurringTransactions}
            bankBalance={bankBalance}
            debtBalance={debtBalance}
          />
        </div>

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
          selectedMonth={selectedMonth}
        />

        <ExpenseCategoriesChart transactions={transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RunwayChart 
            data={calculateRunway(true)} 
            title="with.initial.balances"
            showIncomeExpenses={false}
          />
          <RunwayChart 
            data={calculateRunway(false)} 
            title="without.initial.balances"
            showIncomeExpenses={true}
          />
        </div>

        <FinancialAnalysis
          transactions={transactions}
          recurringTransactions={recurringTransactions}
          currentBalance={parseFloat(bankBalance)}
          debtBalance={parseFloat(debtBalance)}
        />
      </div>
    </div>
  );
};

export default Index;
