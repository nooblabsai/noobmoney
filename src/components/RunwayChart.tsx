import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RunwayChartProps {
  data: {
    month: string;
    balance: number;
    income?: number;
    expenses?: number;
  }[];
  title: string;
  showIncomeExpenses?: boolean;
}

const RunwayChart: React.FC<RunwayChartProps> = ({ data, title, showIncomeExpenses = false }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="text-sm font-semibold mb-2">Month: {label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`${entry.name}-${index}`}
              className={`text-sm ${
                entry.name === 'Balance'
                  ? 'text-primary'
                  : entry.name === 'Income'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 h-[400px] animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke="#1e3a8a"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
          {showIncomeExpenses && (
            <>
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#dc2626"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RunwayChart;