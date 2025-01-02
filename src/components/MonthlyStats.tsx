import React, { useMemo } from 'react';
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

  const getMonthOptions = () => {
    const options = [];
    // Add 6 months before current month
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

  return (
    <div className="mb-8">
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
    </div>
  );
};

export default MonthlyStats;