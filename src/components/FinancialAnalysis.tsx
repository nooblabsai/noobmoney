import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  const [showApiKeyDialog, setShowApiKeyDialog] = React.useState(false);
  const [apiKey, setApiKey] = React.useState('');

  const generateAnalysis = async () => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    
    if (!storedApiKey) {
      setShowApiKeyDialog(true);
      return;
    }

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
          'Authorization': `Bearer ${storedApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
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
      console.error('Analysis error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate financial analysis. Please ensure your OpenAI API key is valid.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setShowApiKeyDialog(false);
      setApiKey('');
      generateAnalysis();
    }
  };

  return (
    <>
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

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OpenAI API Key</DialogTitle>
            <DialogDescription>
              Please enter your OpenAI API key to generate financial analysis. This will be stored securely in your browser.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApiKeySubmit()}
            />
            <Button onClick={handleApiKeySubmit} disabled={!apiKey.trim()}>
              Save and Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinancialAnalysis;