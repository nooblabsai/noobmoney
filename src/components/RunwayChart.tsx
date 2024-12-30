import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface RunwayChartProps {
  data: Array<{
    month: string;
    balance: number;
    income?: number;
    expenses?: number;
  }>;
  title: 'with.initial.balances' | 'without.initial.balances';
  showIncomeExpenses: boolean;
}

const RunwayChart: React.FC<RunwayChartProps> = ({ data, title, showIncomeExpenses }) => {
  const { t } = useLanguage();
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {t('financial.runway')} ({t(title)})
      </h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="#8884d8" 
              name={t('balance')}
            />
            {showIncomeExpenses && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#82ca9d" 
                  name={t('income')}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ff7300" 
                  name={t('expense')}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RunwayChart;