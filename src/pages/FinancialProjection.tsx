import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectionData {
  month: string;
  revenue: number;
  arr: number;
}

const FinancialProjection = () => {
  const { t } = useLanguage();
  const [monthlyRevenue, setMonthlyRevenue] = useState<string>('100');
  const [startingCustomers, setStartingCustomers] = useState<string>('10');
  const [monthlyGrowth, setMonthlyGrowth] = useState<string>('10');
  const [projectionData, setProjectionData] = useState<ProjectionData[]>([]);

  const calculateProjection = () => {
    const mrr = parseFloat(monthlyRevenue);
    const initialCustomers = parseInt(startingCustomers);
    const growth = parseFloat(monthlyGrowth) / 100; // Convert percentage to decimal

    const data: ProjectionData[] = [];
    let customers = initialCustomers;

    // Calculate 12 months of projections
    for (let i = 0; i < 12; i++) {
      const monthlyRevenue = customers * mrr;
      const arr = monthlyRevenue * 12;
      
      data.push({
        month: `Month ${i + 1}`,
        revenue: parseFloat(monthlyRevenue.toFixed(2)),
        arr: parseFloat(arr.toFixed(2))
      });

      // Apply monthly growth
      customers = customers * (1 + growth);
    }

    setProjectionData(data);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">{t('financial.projection.calculator')}</h1>
      
      <Card className="p-6">
        <div className="grid gap-6 mb-6">
          <div>
            <Label htmlFor="monthlyRevenue">{t('monthly.revenue.per.customer')}</Label>
            <Input
              id="monthlyRevenue"
              type="number"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(e.target.value)}
              placeholder="100"
            />
          </div>
          
          <div>
            <Label htmlFor="startingCustomers">{t('starting.customers')}</Label>
            <Input
              id="startingCustomers"
              type="number"
              value={startingCustomers}
              onChange={(e) => setStartingCustomers(e.target.value)}
              placeholder="10"
            />
          </div>
          
          <div>
            <Label htmlFor="monthlyGrowth">{t('monthly.growth.percentage')}</Label>
            <Input
              id="monthlyGrowth"
              type="number"
              value={monthlyGrowth}
              onChange={(e) => setMonthlyGrowth(e.target.value)}
              placeholder="10"
            />
          </div>
          
          <Button onClick={calculateProjection} className="w-full">
            {t('calculate.projection')}
          </Button>
        </div>
      </Card>

      {projectionData.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('revenue.projection')}</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`€${value.toFixed(2)}`, '']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  name={t('monthly.revenue')}
                />
                <Line 
                  type="monotone" 
                  dataKey="arr" 
                  stroke="#82ca9d" 
                  name={t('annual.recurring.revenue')}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FinancialProjection;