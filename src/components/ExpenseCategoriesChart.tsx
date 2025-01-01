import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, isSameMonth, isBefore, startOfMonth, endOfMonth } from 'date-fns';
import { Transaction } from '@/types/transactions';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExpenseCategoriesChartProps {
  transactions: Transaction[];
  selectedDate: Date;
}

const ExpenseCategoriesChart: React.FC<ExpenseCategoriesChartProps> = ({
  transactions,
  selectedDate,
}) => {
  const { t } = useLanguage();

  const calculateData = () => {
    const selectedMonthStart = startOfMonth(selectedDate);
    const selectedMonthEnd = endOfMonth(selectedDate);

    // Get one-time transactions for the selected month
    const oneTimeTransactions = transactions.filter(t => {
      if ('startDate' in t) return false; // Skip recurring transactions
      const transactionDate = new Date(t.date);
      return !t.isIncome && isSameMonth(transactionDate, selectedDate);
    });

    // Get recurring transactions that are active in the selected month
    const recurringTransactions = transactions.filter(t => {
      if (!('startDate' in t)) return false; // Skip non-recurring transactions
      if (t.isIncome) return false; // Skip income transactions
      const startDate = new Date(t.startDate as string | number | Date);
      return (isBefore(startDate, selectedMonthEnd) || isSameMonth(startDate, selectedDate));
    });

    // Combine both types of transactions
    const relevantTransactions = [...oneTimeTransactions, ...recurringTransactions];

    console.log('Selected month:', format(selectedDate, 'MMMM yyyy'));
    console.log('One-time transactions:', oneTimeTransactions);
    console.log('Recurring transactions:', recurringTransactions);
    console.log('All relevant transactions:', relevantTransactions);

    // Group transactions by category and sum amounts
    const categoryTotals = relevantTransactions.reduce((acc, transaction) => {
      const category = transaction.category || 'other';
      const amount = Math.abs(parseFloat(transaction.amount.toString()));
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to chart data format and sort by amount
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name: t(`category.${name}`), // Translate category names
        amount: value,
        originalName: name, // Keep original name for reference
      }))
      .sort((a, b) => b.amount - a.amount); // Sort by amount in descending order
  };

  const data = calculateData();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        {t('no.categorized.expenses')}
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis 
            tickFormatter={(value) => `€${value}`}
          />
          <Tooltip 
            formatter={(value: number) => [`€${value.toFixed(2)}`, 'Amount']}
          />
          <Bar 
            dataKey="amount" 
            fill="#1e3a8a"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseCategoriesChart;