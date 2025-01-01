import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ExpenseCategory, getCategoryColor } from '@/types/categories';
import { useLanguage } from '@/contexts/LanguageContext';
import { Transaction } from '@/types/transactions';
import { isSameMonth, addMonths } from 'date-fns';

interface ExpenseCategoriesChartProps {
  transactions: Transaction[];
  selectedMonth?: string;
}

const ExpenseCategoriesChart: React.FC<ExpenseCategoriesChartProps> = ({ 
  transactions,
  selectedMonth = '0'
}) => {
  const { t } = useLanguage();

  const expensesByCategory = React.useMemo(() => {
    const selectedDate = addMonths(new Date(), parseInt(selectedMonth));
    
    // Filter transactions for the selected month
    const filteredTransactions = selectedMonth 
      ? transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return isSameMonth(transactionDate, selectedDate);
        })
      : transactions;

    // Get recurring transactions that started before or during this month
    const recurringTransactions = transactions.filter(t => {
      if (!('startDate' in t)) return false; // Skip non-recurring transactions
      const startDate = new Date(t.startDate);
      return startDate <= selectedDate;
    });

    // Combine regular and recurring transactions
    const allTransactions = [
      ...filteredTransactions,
      ...recurringTransactions
    ];

    const categories = Object.values(ExpenseCategory);
    const expenses = categories.map(category => {
      const total = allTransactions
        .filter(t => !t.isIncome && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: t(category),
        value: total,
        category: category
      };
    })
    .filter(category => category.value > 0);

    console.log('Expenses by category (including recurring):', expenses);
    return expenses;
  }, [transactions, selectedMonth, t]);

  if (expensesByCategory.length === 0) {
    return (
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('expenses.by.category')}</h2>
        <div className="text-center text-gray-500 py-4">
          {t('no.categorized.expenses')}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">{t('expenses.by.category')}</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expensesByCategory}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={({ name, value }) => `${name}: €${value.toFixed(2)}`}
            >
              {expensesByCategory.map((entry) => (
                <Cell 
                  key={`cell-${entry.category}`}
                  fill={getCategoryColor(entry.category)}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `€${value.toFixed(2)}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ExpenseCategoriesChart;