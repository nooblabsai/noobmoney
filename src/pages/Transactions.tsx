import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TransactionHistory from '@/components/TransactionHistory';
import { useTransactions } from '@/hooks/useTransactions';
import { useLanguage } from '@/contexts/LanguageContext';

const Transactions = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState('0');
  const {
    transactions,
    recurringTransactions,
    handleDeleteTransaction,
    setTransactions,
    setRecurringTransactions,
  } = useTransactions();

  const handleTransactionsUpdate = (updatedTransactions: any[], updatedRecurringTransactions: any[]) => {
    setTransactions(updatedTransactions);
    setRecurringTransactions(updatedRecurringTransactions);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('transaction.history')}</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          {t('back.to.dashboard')}
        </Button>
      </div>
      <TransactionHistory
        transactions={transactions}
        recurringTransactions={recurringTransactions}
        onDeleteTransaction={handleDeleteTransaction}
        selectedMonth={selectedMonth}
        onTransactionsUpdate={handleTransactionsUpdate}
      />
    </div>
  );
};

export default Transactions;