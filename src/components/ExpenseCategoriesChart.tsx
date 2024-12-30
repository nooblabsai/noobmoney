import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ExpenseCategory, getCategoryColor } from '@/types/categories';
import { useLanguage } from '@/contexts/LanguageContext';
import { Transaction } from '@/types/transactions';

interface ExpenseCategoriesChartProps {
  transactions: Transaction[];
}

const ExpenseCategoriesChart: React.FC<ExpenseCategoriesChartProps> = ({ transactions }) => {
  const { t } = useLanguage();

  const expensesByCategory = React.useMemo(() => {
    const categories = Object.values(ExpenseCategory);
    const expenses = categories.map(category => ({
      name: t(category),
      value: transactions
        .filter(t => !t.isIncome && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0)
    }))
    .filter(category => category.value > 0);

    console.log('Expenses by category:', expenses);
    return expenses;
  }, [transactions, t]);

  if (expensesByCategory.length === 0) {
    return null;
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
              {expensesByCategory.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={getCategoryColor(Object.values(ExpenseCategory)[index])}
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