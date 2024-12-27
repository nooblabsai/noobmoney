import React from 'react';
import { Card } from '@/components/ui/card';
import { format, addMonths } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Transaction {
  amount: number;
  description: string;
  isIncome: boolean;
  date: Date;
}

interface MonthlyStatsProps {
  transactions: Transaction[];
  recurringTransactions: Transaction[];
  selectedMonth: string;
  onMonthSelect: (month: string) => void;
}

const MonthlyStats: React.FC<MonthlyStatsProps> = ({
  transactions,
  recurringTransactions,
  selectedMonth,
  onMonthSelect,
}) => {
  const getMonthOptions = () => {
    const options = [];
    for (let i = 0; i < 12; i++) {
      const date = addMonths(new Date(), i);
      options.push({
        value: i.toString(),
        label: format(date, 'MMMM yyyy')
      });
    }
    return options;
  };

  const getBalanceForMonth = (monthOffset: number) => {
    const targetDate = addMonths(new Date(), monthOffset);
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    // Get one-time transactions for the month
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === targetMonth && 
             transactionDate.getFullYear() === targetYear;
    });

    // Calculate balance from one-time transactions
    const oneTimeBalance = monthTransactions.reduce((acc, t) => 
      acc + (t.isIncome ? t.amount : -t.amount), 0);

    // Add recurring transactions
    const recurringBalance = recurringTransactions.reduce((acc, t) => 
      acc + (t.isIncome ? t.amount : -t.amount), 0);

    return oneTimeBalance + recurringBalance;
  };

  const getRecurringTotalForMonth = (isIncome: boolean) => {
    return recurringTransactions
      .filter(t => t.isIncome === isIncome)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <Select value={selectedMonth} onValueChange={onMonthSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
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
          <h3 className="text-lg font-medium mb-2">Balance for {format(addMonths(new Date(), parseInt(selectedMonth)), 'MMMM yyyy')}</h3>
          <p className={`text-2xl font-bold ${getBalanceForMonth(parseInt(selectedMonth)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            €{getBalanceForMonth(parseInt(selectedMonth)).toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Monthly Income</h3>
          <p className="text-2xl font-bold text-green-600">
            €{getRecurringTotalForMonth(true).toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Monthly Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            €{getRecurringTotalForMonth(false).toFixed(2)}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default MonthlyStats;