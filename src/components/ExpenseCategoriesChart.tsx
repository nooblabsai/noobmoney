import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, isSameMonth, isBefore, startOfMonth, endOfMonth } from 'date-fns';
import { Transaction } from '@/types/transactions';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExpenseCategoriesChartProps {
  transactions: Transaction[];
  selectedDate: Date;
}

const COLORS = [
  '#8B5CF6', // Vivid Purple
  '#0EA5E9', // Ocean Blue
  '#F97316', // Bright Orange
  '#D946EF', // Magenta Pink
  '#22C55E', // Green
  '#EAB308', // Yellow
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#A855F7', // Purple
];

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
        name,  // Use original category name
        displayName: t(`category.${name}`), // Store translated name separately
        amount: value,
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const data = calculateData();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        {t('no.categorized.expenses')}
      </div>
    );
  }

  const chartTitle = format(selectedDate, 'MMMM yyyy');

  return (
    <div className="w-full h-[300px]">
      <h3 className="text-lg font-semibold mb-4 text-center">
        {t('expenses.by.category')} - {chartTitle}
      </h3>
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
            labelFormatter={(label) => {
              const item = data.find(d => d.name === label);
              return item ? item.displayName : label;
            }}
          />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseCategoriesChart;