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
import { supabase } from '@/lib/supabaseClient';
import { calculateRunway } from '@/utils/runwayCalculations';
import { Transaction, RecurringTransaction } from '@/types/transactions';

// Create a new component for the data management section
const DataManagementSection = ({ 
  onDataLoaded, 
  transactions, 
  recurringTransactions, 
  bankBalance, 
  debtBalance, 
  onReset, 
  handleExportPDF 
}: {
  onDataLoaded: (t: Transaction[], rt: RecurringTransaction[], bb: string, db: string) => void;
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  bankBalance: string;
  debtBalance: string;
  onReset: () => void;
  handleExportPDF: () => void;
}) => (
  <div className="flex justify-end gap-4 mb-4">
    <LoadDataButton onDataLoaded={onDataLoaded} />
    <SaveDataButton
      transactions={transactions}
      recurringTransactions={recurringTransactions}
      bankBalance={bankBalance}
      debtBalance={debtBalance}
      onReset={onReset}
    />
  </div>
);

// Create a new component for the charts section
const ChartsSection = ({ 
  transactions, 
  selectedDate, 
  bankBalance, 
  debtBalance, 
  recurringTransactions,
  t 
}: {
  transactions: Transaction[];
  selectedDate: Date;
  bankBalance: string;
  debtBalance: string;
  recurringTransactions: RecurringTransaction[];
  t: (key: string) => string;
}) => (
  <div>
    <ExpenseCategoriesChart 
      transactions={transactions}
      selectedDate={selectedDate}
    />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <RunwayChart 
        data={calculateRunway(true, bankBalance, debtBalance, transactions, recurringTransactions)} 
        title={t('financial.runway.with.balances')}
        showIncomeExpenses={false}
      />
      <RunwayChart 
        data={calculateRunway(false, bankBalance, debtBalance, transactions, recurringTransactions)} 
        title={t('financial.runway.without.balances')}
        showIncomeExpenses={true}
      />
    </div>
  </div>
);

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

  useEffect(() => {
    localStorage.setItem('bankBalance', bankBalance);
  }, [bankBalance]);

  useEffect(() => {
    localStorage.setItem('debtBalance', debtBalance);
  }, [debtBalance]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const getSelectedMonthDate = () => {
    const currentDate = new Date();
    const monthOffset = parseInt(selectedMonth);
    currentDate.setMonth(currentDate.getMonth() + monthOffset);
    return currentDate;
  };

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