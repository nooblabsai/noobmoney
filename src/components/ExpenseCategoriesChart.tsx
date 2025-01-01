import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { format, isSameMonth, isBefore, startOfMonth, endOfMonth } from 'date-fns';
import { Transaction } from '@/types/transactions';

interface ExpenseCategoriesChartProps {
  transactions: Transaction[];
  selectedDate: Date;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ExpenseCategoriesChart: React.FC<ExpenseCategoriesChartProps> = ({
  transactions,
  selectedDate,
}) => {
  const calculateData = () => {
    const selectedMonthStart = startOfMonth(selectedDate);
    const selectedMonthEnd = endOfMonth(selectedDate);

    // Get one-time transactions for the selected month
    const oneTimeTransactions = transactions.filter(t => {
      if ('startDate' in t) return false; // Skip recurring transactions
      const transactionDate = new Date(t.date);
      return isSameMonth(transactionDate, selectedDate) && !t.isIncome;
    });

    // Get recurring transactions that are active in the selected month
    const recurringTransactions = transactions.filter(t => {
      if (!('startDate' in t)) return false; // Skip non-recurring transactions
      if (t.isIncome) return false; // Skip income transactions
      const startDate = new Date(t.startDate as string | number | Date);
      // Include if start date is before or within the selected month
      return (isBefore(startDate, selectedMonthEnd) || isSameMonth(startDate, selectedDate));
    });

    console.log('Selected month:', format(selectedDate, 'MMMM yyyy'));
    console.log('One-time transactions:', oneTimeTransactions);
    console.log('Recurring transactions:', recurringTransactions);

    // Combine both types of transactions
    const relevantTransactions = [...oneTimeTransactions, ...recurringTransactions];

    // Group transactions by category and sum amounts
    const categoryTotals = relevantTransactions.reduce((acc, transaction) => {
      const category = transaction.category;
      const amount = parseFloat(transaction.amount.toString());
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to chart data format
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Math.abs(value), // Use absolute value for positive numbers in chart
    }));
  };

  const data = calculateData();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        No expenses for this period
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              value,
              index,
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = 25 + innerRadius + (outerRadius - innerRadius);
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  fill="#666"
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                >
                  {`€${value.toFixed(2)}`}
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseCategoriesChart;