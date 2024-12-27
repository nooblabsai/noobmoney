import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Transaction {
  amount: number;
  description: string;
  isIncome: boolean;
  date: Date;
}

interface FinancialAnalysisProps {
  transactions: Transaction[];
  recurringTransactions: Transaction[];
  currentBalance: number;
}

const FinancialAnalysis: React.FC<FinancialAnalysisProps> = ({
  transactions,
  recurringTransactions,
  currentBalance,
}) => {
  const { toast } = useToast();
  const [analysis, setAnalysis] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);

  const generateAnalysis = async () => {
    setLoading(true);
    try {
      const monthlyRecurringIncome = recurringTransactions
        .filter(t => t.isIncome)
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyRecurringExpenses = recurringTransactions
        .filter(t => !t.isIncome)
        .reduce((sum, t) => sum + t.amount, 0);

      const prompt = `As a financial advisor, analyze this financial situation:
        Current Balance: €${currentBalance}
        Monthly Recurring Income: €${monthlyRecurringIncome}
        Monthly Recurring Expenses: €${monthlyRecurringExpenses}
        Number of one-time transactions: ${transactions.length}
        
        Please provide a brief analysis of the financial health and runway, along with actionable advice for improvement. Keep the response concise and focused on the most important points.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate analysis');
      }

      const data = await response.json();
      setAnalysis(data.choices[0].message.content);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate financial analysis. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Financial Analysis</h2>
        <Button onClick={generateAnalysis} disabled={loading}>
          <Brain className="mr-2 h-4 w-4" />
          {loading ? 'Analyzing...' : 'Generate Analysis'}
        </Button>
      </div>
      {analysis && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="whitespace-pre-line">{analysis}</p>
        </div>
      )}
    </Card>
  );
};

export default FinancialAnalysis;