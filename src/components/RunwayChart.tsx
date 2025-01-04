import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface RunwayChartProps {
  data: Array<{
    month: string;
    balance: number;
    income?: number;
    expenses?: number;
  }>;
  title: string;
  showIncomeExpenses?: boolean;
}

const RunwayChart: React.FC<RunwayChartProps> = ({ data, title, showIncomeExpenses = false }) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(title)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            {showIncomeExpenses && (
              <>
                <Line type="monotone" dataKey="income" stroke="#82ca9d" />
                <Line type="monotone" dataKey="expenses" stroke="#ff7300" />
              </>
            )}
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
};

export default RunwayChart;