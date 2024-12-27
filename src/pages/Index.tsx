import React from 'react';
import TransactionManager from '@/components/TransactionManager';
import RunwayChart from '@/components/RunwayChart';
import TransactionHistory from '@/components/TransactionHistory';
import MonthlyStats from '@/components/MonthlyStats';
import FinancialAnalysis from '@/components/FinancialAnalysis';
import LanguageMenu from '@/components/LanguageMenu';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Wallet, PiggyBank, FileDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction, RecurringTransaction } from '@/types/transactions';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Index = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = React.useState('0');
  const [bankBalance, setBankBalance] = React.useState(() => {
    const saved = localStorage.getItem('bankBalance');
    return saved ? saved : '0';
  });
  const [debtBalance, setDebtBalance] = React.useState(() => {
    const saved = localStorage.getItem('debtBalance');
    return saved ? saved : '0';
  });

  const {
    transactions,
    recurringTransactions,
    handleAddTransaction,
    handleAddRecurringTransaction,
    handleDeleteTransaction,
  } = useTransactions();

  React.useEffect(() => {
    localStorage.setItem('bankBalance', bankBalance);
  }, [bankBalance]);

  React.useEffect(() => {
    localStorage.setItem('debtBalance', debtBalance);
  }, [debtBalance]);

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
    toast({
      title: t('reset.complete'),
      description: t('data.cleared'),
    });
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('financial-report');
    if (!element) return;

    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your financial report...",
      });

      // Temporarily modify styles for better PDF capture
      const originalStyle = element.style.cssText;
      element.style.backgroundColor = '#ffffff';
      
      // Force all text to be black for better contrast
      const textElements = element.querySelectorAll('p, h1, h2, h3, span, div');
      const originalColors = new Map();
      textElements.forEach(el => {
        originalColors.set(el, el.style.color);
        el.style.color = '#000000';
      });

      // Ensure charts are using high contrast colors
      const chartElements = element.querySelectorAll('.recharts-line-curve');
      chartElements.forEach(el => {
        if (el.getAttribute('stroke') === '#1e3a8a') {
          el.setAttribute('stroke', '#1A1F2C'); // Darker blue
        } else if (el.getAttribute('stroke') === '#16a34a') {
          el.setAttribute('stroke', '#0EA5E9'); // Brighter blue
        } else if (el.getAttribute('stroke') === '#dc2626') {
          el.setAttribute('stroke', '#F97316'); // Bright orange
        }
      });

      const canvas = await html2canvas(element, {
        scale: 2, // Increase resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('financial-report');
          if (clonedElement) {
            clonedElement.style.width = `${element.scrollWidth}px`;
            clonedElement.style.height = `${element.scrollHeight}px`;
          }
        }
      });

      // Calculate dimensions to ensure full capture
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Split into multiple pages if content is too long
      let position = 0;
      const maxHeight = 297; // A4 height in mm
      
      while (position < imgHeight) {
        if (position > 0) {
          pdf.addPage();
        }
        
        const height = Math.min(maxHeight, imgHeight - position);
        const canvas2 = document.createElement('canvas');
        canvas2.width = canvas.width;
        canvas2.height = (height * canvas.width) / imgWidth;
        
        const ctx = canvas2.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            (position * canvas.width) / imgWidth,
            canvas.width,
            canvas2.height,
            0,
            0,
            canvas2.width,
            canvas2.height
          );
        }
        
        const imgData = canvas2.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, height);
        position += maxHeight;
      }

      pdf.save('financial-report.pdf');

      // Restore original styles
      element.style.cssText = originalStyle;
      textElements.forEach(el => {
        el.style.color = originalColors.get(el) || '';
      });

      toast({
        title: "Export Complete",
        description: "Your financial report has been downloaded.",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateRunway = (includeInitialBalances: boolean) => {
    const data = [];
    const currentDate = new Date();
    let runningBalance = includeInitialBalances ? parseFloat(bankBalance) - parseFloat(debtBalance) : 0;
    
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + i + 1, 0);

      const monthlyRecurringIncome = recurringTransactions
        .filter(t => t.isIncome && new Date(t.startDate) <= monthEnd)
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyRecurringExpenses = recurringTransactions
        .filter(t => !t.isIncome && new Date(t.startDate) <= monthEnd)
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyOneTimeIncome = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return t.isIncome && transactionDate >= monthStart && transactionDate <= monthEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyOneTimeExpenses = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return !t.isIncome && transactionDate >= monthStart && transactionDate <= monthEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const totalIncome = monthlyRecurringIncome + monthlyOneTimeIncome;
      const totalExpenses = monthlyRecurringExpenses + monthlyOneTimeExpenses;
      runningBalance += totalIncome - totalExpenses;

      data.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        balance: runningBalance,
        income: totalIncome,
        expenses: totalExpenses,
      });
    }

    return data;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">{t('financial.runway.calculator')}</h1>
        <div className="flex items-center gap-4">
          <Button onClick={handleExportPDF} className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
          <LanguageMenu />
          <Button variant="destructive" onClick={handleReset} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            {t('reset.data')}
          </Button>
        </div>
      </div>

      <div id="financial-report">
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="h-6 w-6 text-primary" />
                <Label htmlFor="bankBalance" className="text-xl font-semibold">{t('current.bank.balance')}</Label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-primary">€</span>
                <Input
                  id="bankBalance"
                  type="text"
                  value={bankBalance}
                  onChange={(e) => setBankBalance(e.target.value)}
                  className="text-4xl font-bold h-16 max-w-xs"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <PiggyBank className="h-6 w-6 text-red-500" />
                <Label htmlFor="debtBalance" className="text-xl font-semibold">Current Debt Balance</Label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-red-500">€</span>
                <Input
                  id="debtBalance"
                  type="text"
                  value={debtBalance}
                  onChange={(e) => setDebtBalance(e.target.value)}
                  className="text-4xl font-bold h-16 max-w-xs"
                />
              </div>
            </div>
          </div>
        </Card>
        
        <TransactionManager
          onAddTransaction={handleAddTransaction}
          onAddRecurringTransaction={handleAddRecurringTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />

        <MonthlyStats
          transactions={transactions}
          recurringTransactions={recurringTransactions}
          selectedMonth={selectedMonth}
          onMonthSelect={setSelectedMonth}
        />

        <TransactionHistory
          transactions={transactions}
          recurringTransactions={recurringTransactions}
          onDeleteTransaction={handleDeleteTransaction}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RunwayChart 
            data={calculateRunway(true)} 
            title="Financial Runway (with initial balances)"
            showIncomeExpenses={false}
          />
          <RunwayChart 
            data={calculateRunway(false)} 
            title="Financial Runway (without initial balances)"
            showIncomeExpenses={true}
          />
        </div>

        <FinancialAnalysis
          transactions={transactions}
          recurringTransactions={recurringTransactions}
          currentBalance={parseFloat(bankBalance)}
          debtBalance={parseFloat(debtBalance)}
        />
      </div>
    </div>
  );
};

export default Index;
