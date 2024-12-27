import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
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
  debtBalance: number;
}

const FinancialAnalysis: React.FC<FinancialAnalysisProps> = ({
  transactions,
  recurringTransactions,
  currentBalance,
  debtBalance,
}) => {
  const { toast } = useToast();
  const { language, t } = useLanguage();
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

      const oneTimeIncome = transactions
        .filter(t => t.isIncome)
        .reduce((sum, t) => sum + t.amount, 0);

      const oneTimeExpenses = transactions
        .filter(t => !t.isIncome)
        .reduce((sum, t) => sum + t.amount, 0);

      const systemPrompt = language === 'el' 
        ? 'Είσαι ένας οικονομικός σύμβουλος. Ανάλυσε την οικονομική κατάσταση και δώσε συμβουλές στα Ελληνικά.'
        : 'You are a financial advisor. Analyze the financial situation and provide advice in English.';

      const prompt = language === 'el'
        ? `Ανάλυσε την παρακάτω οικονομική κατάσταση:
          Τρέχον Υπόλοιπο: €${currentBalance}
          Τρέχον Χρέος: €${debtBalance}
          Καθαρή Θέση: €${currentBalance - debtBalance}
          Μηνιαία Επαναλαμβανόμενα Έσοδα: €${monthlyRecurringIncome}
          Μηνιαία Επαναλαμβανόμενα Έξοδα: €${monthlyRecurringExpenses}
          Συνολικά Έκτακτα Έσοδα: €${oneTimeIncome}
          Συνολικά Έκτακτα Έξοδα: €${oneTimeExpenses}
          Αριθμός μη επαναλαμβανόμενων συναλλαγών: ${transactions.length}
          Αριθμός επαναλαμβανόμενων συναλλαγών: ${recurringTransactions.length}
          Καθαρή Μηνιαία Ροή: €${monthlyRecurringIncome - monthlyRecurringExpenses}
          
          Παρακαλώ δώσε μια σύντομη ανάλυση της οικονομικής υγείας και διάρκειας, μαζί με εφαρμόσιμες συμβουλές για βελτίωση. Κράτησε την απάντηση συνοπτική και εστιασμένη στα πιο σημαντικά σημεία.`
        : `As a financial advisor, analyze this financial situation:
          Current Balance: €${currentBalance}
          Current Debt: €${debtBalance}
          Net Worth: €${currentBalance - debtBalance}
          Monthly Recurring Income: €${monthlyRecurringIncome}
          Monthly Recurring Expenses: €${monthlyRecurringExpenses}
          Total One-time Income: €${oneTimeIncome}
          Total One-time Expenses: €${oneTimeExpenses}
          Number of one-time transactions: ${transactions.length}
          Number of recurring transactions: ${recurringTransactions.length}
          Net Monthly Cash Flow: €${monthlyRecurringIncome - monthlyRecurringExpenses}
          
          Please provide a brief analysis of the financial health and runway, along with actionable advice for improvement. Keep the response concise and focused on the most important points.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
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
          <h2 className="text-xl font-semibold">{t('financial.analysis')}</h2>
          <Button onClick={generateAnalysis} disabled={loading}>
            <Brain className="mr-2 h-4 w-4" />
            {loading ? t('analyzing') : t('generate.analysis')}
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