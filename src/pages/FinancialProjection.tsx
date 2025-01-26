import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HeaderSection } from '@/components/HeaderSection';

interface ProjectionData {
  month: string;
  revenue: number;
  arr: number;
  customers: number;
}

const FinancialProjection = () => {
  const { t } = useLanguage();
  const [annualRevenue, setAnnualRevenue] = useState<string>('1200');
  const [startingCustomers, setStartingCustomers] = useState<string>('10');
  const [monthlyGrowth, setMonthlyGrowth] = useState<string>('10');
  const [annualChurn, setAnnualChurn] = useState<string>('5');
  const [months, setMonths] = useState<string>('12');
  const [projectionData, setProjectionData] = useState<ProjectionData[]>([]);

  const handleExportPDF = () => {
    // Placeholder for PDF export functionality
  };

  const calculateProjection = () => {
    const arr = parseFloat(annualRevenue);
    const mrr = arr / 12; // Convert annual to monthly revenue
    const initialCustomers = parseInt(startingCustomers);
    const growth = parseFloat(monthlyGrowth) / 100; // Convert percentage to decimal
    const monthlyChurn = parseFloat(annualChurn) / 12 / 100; // Convert annual churn to monthly decimal
    const numberOfMonths = parseInt(months);

    const data: ProjectionData[] = [];
    let customers = initialCustomers;

    // Calculate projections for selected number of months
    for (let i = 0; i < numberOfMonths; i++) {
      // Apply growth and churn to customer base
      const netGrowthRate = growth - monthlyChurn;
      customers = customers * (1 + netGrowthRate);
      
      const monthlyRevenue = customers * mrr;
      const annualRecurringRevenue = monthlyRevenue * 12;
      
      data.push({
        month: `Month ${i + 1}`,
        revenue: parseFloat(monthlyRevenue.toFixed(2)),
        arr: parseFloat(annualRecurringRevenue.toFixed(2)),
        customers: Math.round(customers)
      });
    }

    setProjectionData(data);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <HeaderSection t={t} handleExportPDF={handleExportPDF} />
      
      <Card className="p-6">
        <div className="grid gap-6 mb-6">
          <div>
            <Label htmlFor="annualRevenue">{t('annual.revenue.per.customer')}</Label>
            <Input
              id="annualRevenue"
              type="number"
              value={annualRevenue}
              onChange={(e) => setAnnualRevenue(e.target.value)}
              placeholder="1200"
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

          <div>
            <Label htmlFor="annualChurn">{t('annual.churn.rate')}</Label>
            <Input
              id="annualChurn"
              type="number"
              value={annualChurn}
              onChange={(e) => setAnnualChurn(e.target.value)}
              placeholder="5"
            />
          </div>

          <div>
            <Label>{t('projection.period')}</Label>
            <RadioGroup
              value={months}
              onValueChange={setMonths}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12" id="m12" />
                <Label htmlFor="m12">12 {t('months')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24" id="m24" />
                <Label htmlFor="m24">24 {t('months')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="36" id="m36" />
                <Label htmlFor="m36">36 {t('months')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="48" id="m48" />
                <Label htmlFor="m48">48 {t('months')}</Label>
              </div>
            </RadioGroup>
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
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === t('number.of.customers')) {
                      return [Math.round(value), name];
                    }
                    return [`€${value.toFixed(2)}`, name];
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  name={t('monthly.revenue')}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="arr" 
                  stroke="#82ca9d" 
                  name={t('annual.recurring.revenue')}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="customers" 
                  stroke="#ff7300" 
                  name={t('number.of.customers')}
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