import React, { useEffect, useState } from 'react';
import TransactionManager from '@/components/TransactionManager';
import TransactionHistory from '@/components/TransactionHistory';
import MonthlyStats from '@/components/MonthlyStats';
import FinancialAnalysis from '@/components/FinancialAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useTransactions } from '@/hooks/useTransactions';
import { BalanceSection } from '@/components/BalanceSection';
import { HeaderSection } from '@/components/HeaderSection';
import { exportToPDF } from '@/utils/pdfExport';
import { supabase } from '@/lib/supabaseClient';
import { Transaction, RecurringTransaction } from '@/types/transactions';
import { useBalanceCalculations } from '@/hooks/useBalanceCalculations';
import DataManagementSection from '@/components/sections/DataManagementSection';
import ChartsSection from '@/components/sections/ChartsSection';

const Index = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [initialBankBalance, setInitialBankBalance] = useState(() => {
    const saved = localStorage.getItem('bankBalance');
    return saved ? saved : '0';
  });
  const [bankBalance, setBankBalance] = useState(initialBankBalance);
  const [debtBalance, setDebtBalance] = useState(() => {
    const saved = localStorage.getItem('debtBalance');
    return saved ? saved : '0';
  });

  const {
    transactions,
    recurringTransactions,
    handleAddTransaction,
    handleAddRecurringTransaction,
    handleDeleteTransaction,
    setTransactions,
    setRecurringTransactions,
  } = useTransactions();

  const { calculateUpdatedBalances } = useBalanceCalculations(
    transactions,
    recurringTransactions,
    initialBankBalance,
    debtBalance
  );

  // Effect to update balances when transactions change
  useEffect(() => {
    const { bankBalance: newBankBalance, debtBalance: newDebtBalance } = calculateUpdatedBalances();
    setBankBalance(newBankBalance);
  }, [transactions, recurringTransactions, initialBankBalance]);

  // Effect to save bank balance to localStorage
  useEffect(() => {
    localStorage.setItem('bankBalance', bankBalance);
  }, [bankBalance]);

  // Effect to save debt balance to localStorage
  useEffect(() => {
    localStorage.setItem('debtBalance', debtBalance);
  }, [debtBalance]);

  const handleBankBalanceChange = (value: string) => {
    setInitialBankBalance(value);
    setBankBalance(value);
  };

  const handleTransactionsUpdate = (
    updatedTransactions: Transaction[],
    updatedRecurringTransactions: RecurringTransaction[]
  ) => {
    setTransactions(updatedTransactions);
    setRecurringTransactions(updatedRecurringTransactions);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          localStorage.removeItem('transactions');
          localStorage.removeItem('recurringTransactions');
          localStorage.removeItem('bankBalance');
          localStorage.removeItem('debtBalance');
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast({
          title: t('error'),
          description: t('session.check.failed'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [t, toast]);

  const handleDataLoaded = (
    loadedTransactions: Transaction[], 
    loadedRecurringTransactions: RecurringTransaction[],
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

  const getSelectedMonthDate = () => {
    const currentDate = new Date();
    const monthOffset = parseInt(selectedMonth);
    currentDate.setMonth(currentDate.getMonth() + monthOffset);
    return currentDate;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <HeaderSection
        t={t}
        handleExportPDF={handleExportPDF}
      />

      <DataManagementSection 
        onDataLoaded={handleDataLoaded}
        transactions={transactions}
        recurringTransactions={recurringTransactions}
        bankBalance={bankBalance}
        debtBalance={debtBalance}
        onReset={handleReset}
        handleExportPDF={handleExportPDF}
      />

      <div id="financial-report">
        <BalanceSection
          bankBalance={bankBalance}
          setBankBalance={handleBankBalanceChange}
          debtBalance={debtBalance}
          setDebtBalance={setDebtBalance}
          t={t}
        />

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
          onTransactionsUpdate={handleTransactionsUpdate}
        />

        <ChartsSection 
          transactions={transactions}
          selectedDate={getSelectedMonthDate()}
          bankBalance={bankBalance}
          debtBalance={debtBalance}
          recurringTransactions={recurringTransactions}
          t={t}
        />

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
