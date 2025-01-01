import React, { useEffect, useState } from 'react';
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
import { Transaction } from '@/types/transactions';
import { supabase } from '@/lib/supabaseClient';

const Index = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [bankBalance, setBankBalance] = useState(() => {
    const saved = localStorage.getItem('bankBalance');
    return saved ? saved : '0';
  });
  const [debtBalance, setDebtBalance] = useState(() => {
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

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // Clear any stale data if no valid session exists
          localStorage.removeItem('transactions');
          localStorage.removeItem('recurringTransactions');
          localStorage.removeItem('bankBalance');
          localStorage.removeItem('debtBalance');
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    localStorage.setItem('bankBalance', bankBalance);
  }, [bankBalance]);

  useEffect(() => {
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

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <HeaderSection
        t={t}
        handleExportPDF={handleExportPDF}
        handleReset={handleReset}
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

      <div id="financial-report">
        <BalanceSection
          bankBalance={bankBalance}
          setBankBalance={setBankBalance}
          debtBalance={debtBalance}
          setDebtBalance={setDebtBalance}
          t={t}
        />

        <TransactionManager
          onAddTransaction={addTransaction}
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

        <ExpenseCategoriesChart 
          transactions={transactions}
          selectedMonth={selectedMonth}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RunwayChart 
            data={calculateRunway(true)} 
            title={t('financial.runway.with.balances')}
            showIncomeExpenses={false}
          />
          <RunwayChart 
            data={calculateRunway(false)} 
            title={t('financial.runway.without.balances')}
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

// Helper function for runway calculation
const calculateRunway = (includeInitialBalances: boolean) => {
  const data = [];
  const currentDate = new Date();
  let runningBalance = includeInitialBalances ? parseFloat(bankBalance) - parseFloat(debtBalance) : 0;
  
  // Start from 6 months ago
  for (let i = -6; i < 12; i++) {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + i + 1, 0);

    // Calculate recurring transactions
    const monthlyRecurringIncome = recurringTransactions
      .filter(t => t.isIncome && new Date(t.startDate) <= monthEnd)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyRecurringExpenses = recurringTransactions
      .filter(t => !t.isIncome && new Date(t.startDate) <= monthEnd)
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate one-time transactions that fall within this month
    const monthlyOneTimeIncome = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.isIncome && 
               transactionDate.getFullYear() === monthStart.getFullYear() &&
               transactionDate.getMonth() === monthStart.getMonth();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyOneTimeExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return !t.isIncome && 
               transactionDate.getFullYear() === monthStart.getFullYear() &&
               transactionDate.getMonth() === monthStart.getMonth();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Total income and expenses for the month
    const totalIncome = monthlyRecurringIncome + monthlyOneTimeIncome;
    const totalExpenses = monthlyRecurringExpenses + monthlyOneTimeExpenses;
    
    // Update running balance
    runningBalance += (totalIncome - totalExpenses);

    data.push({
      month: monthStart.toLocaleString('default', { month: 'short' }),
      balance: Number(runningBalance.toFixed(2)),
      income: Number(totalIncome.toFixed(2)),
      expenses: Number(totalExpenses.toFixed(2)),
    });
  }

  return data;
};

export default Index;
