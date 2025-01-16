import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { format, addMonths } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Transaction, RecurringTransaction } from '@/types/transactions';

interface MonthlyStatsProps {
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  selectedMonth: string;
  onMonthSelect: (month: string) => void;
}

const MonthlyStats: React.FC<MonthlyStatsProps> = ({
  transactions,
  recurringTransactions,
  selectedMonth,
  onMonthSelect,
}) => {
  const { t } = useLanguage();
  const [showAnnualStats, setShowAnnualStats] = useState(false);

  const getMonthOptions = () => {
    const options = [];
    for (let i = -6; i < 12; i++) {
      const date = addMonths(new Date(), i);
      options.push({
        value: i.toString(),
        label: format(date, 'MMMM yyyy')
      });
    }
    return options;
  };

  const getBalanceForMonth = useMemo(() => {
    const targetDate = addMonths(new Date(), parseInt(selectedMonth));
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === targetMonth && 
             transactionDate.getFullYear() === targetYear;
    });

    const oneTimeBalance = monthTransactions.reduce((acc, t) => 
      acc + (t.isIncome ? t.amount : -t.amount), 0);

    const recurringBalance = recurringTransactions
      .filter(t => {
        const startDate = new Date(t.startDate);
        return startDate <= targetDate;
      })
      .reduce((acc, t) => acc + (t.isIncome ? t.amount : -t.amount), 0);

    return oneTimeBalance + recurringBalance;
  }, [transactions, recurringTransactions, selectedMonth]);

  const recurringTotals = useMemo(() => {
    const targetDate = addMonths(new Date(), parseInt(selectedMonth));
    
    const income = recurringTransactions
      .filter(t => t.isIncome && new Date(t.startDate) <= targetDate)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = recurringTransactions
      .filter(t => !t.isIncome && new Date(t.startDate) <= targetDate)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expenses };
  }, [recurringTransactions, selectedMonth]);

  const annualTotals = useMemo(() => {
    const currentYear = new Date().getFullYear();
    
    // Calculate annual recurring revenue
    const annualRecurringIncome = recurringTransactions
      .filter(t => t.isIncome && new Date(t.startDate).getFullYear() <= currentYear)
      .reduce((sum, t) => sum + (t.amount * 12), 0);

    // Calculate annual recurring expenses
    const annualRecurringExpenses = recurringTransactions
      .filter(t => !t.isIncome && new Date(t.startDate).getFullYear() <= currentYear)
      .reduce((sum, t) => sum + (t.amount * 12), 0);

    // Calculate one-time transactions for the year
    const yearTransactions = transactions.filter(t => 
      new Date(t.date).getFullYear() === currentYear
    );

    const oneTimeIncome = yearTransactions
      .filter(t => t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    const oneTimeExpenses = yearTransactions
      .filter(t => !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = annualRecurringIncome + oneTimeIncome;
    const totalExpenses = annualRecurringExpenses + oneTimeExpenses;
    const profitLoss = totalIncome - totalExpenses;
    const recurringDifference = annualRecurringIncome - annualRecurringExpenses;

    return {
      totalIncome,
      totalExpenses,
      profitLoss,
      recurringIncome: annualRecurringIncome,
      recurringExpenses: annualRecurringExpenses,
      recurringDifference
    };
  }, [transactions, recurringTransactions]);

  return (
    <div className="mb-8 space-y-8">
      <div className="mb-4">
        <Select value={selectedMonth} onValueChange={onMonthSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('select.month')} />
          </SelectTrigger>
          <SelectContent>
            {getMonthOptions().map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">{t('balance.for')} {format(addMonths(new Date(), parseInt(selectedMonth)), 'MMMM yyyy')}</h3>
          <p className={`text-2xl font-bold ${
            getBalanceForMonth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            €{getBalanceForMonth.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">{t('monthly.recurring.income')}</h3>
          <p className="text-2xl font-bold text-green-600">
            €{recurringTotals.income.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">{t('monthly.recurring.expenses')}</h3>
          <p className="text-2xl font-bold text-red-600">
            €{recurringTotals.expenses.toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setShowAnnualStats(!showAnnualStats)}
          className="gap-2"
        >
          {showAnnualStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showAnnualStats ? t('hide.annual.stats') : t('show.annual.stats')}
        </Button>
      </div>

      <div className={`space-y-6 transition-all duration-300 ${showAnnualStats ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">{t('annual.total.revenue')}</h3>
            <p className="text-2xl font-bold text-green-600">
              €{annualTotals.totalIncome.toFixed(2)}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">{t('annual.total.expenses')}</h3>
            <p className="text-2xl font-bold text-red-600">
              €{annualTotals.totalExpenses.toFixed(2)}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">{t('annual.total.profit.loss')}</h3>
            <p className={`text-2xl font-bold ${
              annualTotals.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              €{annualTotals.profitLoss.toFixed(2)}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">{t('annual.recurring.income')}</h3>
            <p className="text-2xl font-bold text-green-600">
              €{annualTotals.recurringIncome.toFixed(2)}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">{t('annual.recurring.expenses')}</h3>
            <p className="text-2xl font-bold text-red-600">
              €{annualTotals.recurringExpenses.toFixed(2)}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">{t('annual.recurring.difference')}</h3>
            <p className={`text-2xl font-bold ${
              annualTotals.recurringDifference >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              €{annualTotals.recurringDifference.toFixed(2)}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MonthlyStats;