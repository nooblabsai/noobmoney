import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import ApiKeyDialog from './analysis/ApiKeyDialog';
import AnalysisDisplay from './analysis/AnalysisDisplay';

interface FinancialAnalysisProps {
  transactions: any[];
  recurringTransactions: any[];
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
  const { t, language } = useLanguage();
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        title: t('error'),
        description: t('login_required'),
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const getStoredApiKey = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('user_settings')
        .select('openai_api_key')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      return data?.openai_api_key;
    } catch (error) {
      console.error('Error fetching API key:', error);
      return null;
    }
  };

  const saveApiKey = async (key: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          openai_api_key: key
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: t('error'),
        description: t('save.failed'),
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleApiKeySubmit = async () => {
    if (apiKey.trim()) {
      const saved = await saveApiKey(apiKey.trim());
      if (saved) {
        setShowApiKeyDialog(false);
        setApiKey('');
        generateAnalysis();
      }
    }
  };

  const generateAnalysis = async () => {
    const storedApiKey = await getStoredApiKey();
    
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
          model: 'gpt-4',
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

  return (
    <>
      <AnalysisDisplay
        loading={loading}
        analysis={analysis}
        onGenerate={async () => {
          const isAuthenticated = await checkAuth();
          if (isAuthenticated) {
            generateAnalysis();
          }
        }}
        t={t}
      />

      <ApiKeyDialog
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
        apiKey={apiKey}
        setApiKey={setApiKey}
        onSubmit={handleApiKeySubmit}
        t={t}
      />
    </>
  );
};

export default FinancialAnalysis;
