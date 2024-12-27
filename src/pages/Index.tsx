import React from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import RecurringTransactions from '@/components/RecurringTransactions';
import RunwayChart from '@/components/RunwayChart';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, addMonths } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Transaction {
  id: string;
  amount: number;
  description: string;
  isIncome: boolean;
  date: Date;
}

interface RecurringTransaction {
  id: string;
  amount: number;
  description: string;
  isIncome: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = React.useState('0'); // 0 is current month
  const [transactions, setTransactions] = React.useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }));
    }
    return [];
  });

  const [recurringTransactions, setRecurringTransactions] = React.useState<RecurringTransaction[]>(() => {
    const saved = localStorage.getItem('recurringTransactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentBalance, setCurrentBalance] = React.useState(() => {
    const saved = localStorage.getItem('currentBalance');
    return saved ? parseFloat(saved) : 0;
  });

  // Save to localStorage whenever state changes
  React.useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  React.useEffect(() => {
    localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions));
  }, [recurringTransactions]);

  React.useEffect(() => {
    localStorage.setItem('currentBalance', currentBalance.toString());
  }, [currentBalance]);

  const handleAddTransaction = (amount: number, description: string, isIncome: boolean, date: Date) => {
    const newTransaction = {
      id: Math.random().toString(),
      amount,
      description,
      isIncome,
      date,
    };
    setTransactions([...transactions, newTransaction]);
    setCurrentBalance(prev => prev + (isIncome ? amount : -amount));
    
    toast({
      title: `${isIncome ? 'Income' : 'Expense'} Added`,
      description: `${description}: €${amount.toFixed(2)}`,
    });
  };

  const handleAddRecurringTransaction = (transaction: Omit<RecurringTransaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(),
    };
    setRecurringTransactions([...recurringTransactions, newTransaction]);
    
    toast({
      title: 'Recurring Transaction Added',
      description: `${transaction.description}: €${transaction.amount.toFixed(2)} monthly`,
    });
  };

  const handleDeleteRecurringTransaction = (id: string) => {
    setRecurringTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: 'Recurring Transaction Deleted',
    });
  };

  const handleReset = () => {
    localStorage.clear();
    setTransactions([]);
    setRecurringTransactions([]);
    setCurrentBalance(0);
    toast({
      title: 'Reset Complete',
      description: 'All data has been cleared.',
    });
  };

  const getBalanceForMonth = (monthOffset: number) => {
    const targetDate = addMonths(new Date(), monthOffset);
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    // Filter transactions for the specific month
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === targetMonth && 
             transactionDate.getFullYear() === targetYear;
    });

    // Calculate balance from transactions
    return monthTransactions.reduce((acc, t) => 
      acc + (t.isIncome ? t.amount : -t.amount), 0);
  };

  const getRecurringTotalForMonth = (isIncome: boolean) => {
    return recurringTransactions
      .filter(t => t.isIncome === isIncome)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateRunway = () => {
    const monthlyRecurringIncome = recurringTransactions
      .filter(t => t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyRecurringExpenses = recurringTransactions
      .filter(t => !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyNet = monthlyRecurringIncome - monthlyRecurringExpenses;
    const data = [];

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());

    // Get the current month
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Calculate balance for the next 12 months
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const monthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + i + 1, 0);

      // Start with 0 balance for each month
      let monthlyBalance = 0;

      // Add recurring transactions for this month
      monthlyBalance += monthlyNet;

      // Only add one-time transactions that occur in this specific month
      const monthTransactions = sortedTransactions.filter(
        t => t.date >= monthStart && t.date <= monthEnd
      );
      
      for (const transaction of monthTransactions) {
        monthlyBalance += transaction.isIncome ? transaction.amount : -transaction.amount;
      }

      data.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        balance: monthlyBalance,
      });
    }

    return data;
  };

  const getMonthOptions = () => {
    const options = [];
    for (let i = 0; i < 12; i++) {
      const date = addMonths(new Date(), i);
      options.push({
        value: i.toString(),
        label: format(date, 'MMMM yyyy')
      });
    }
    return options;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">Financial Runway Calculator</h1>
        <Button variant="destructive" onClick={handleReset} className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Reset Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
          <ExpenseForm onSubmit={handleAddTransaction} />
        </div>
        <div>
          <RecurringTransactions
            onAdd={handleAddRecurringTransaction}
            transactions={recurringTransactions}
            onDelete={handleDeleteRecurringTransaction}
          />
        </div>
      </div>

      <div className="mb-4">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {getMonthOptions().map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Balance for {format(addMonths(new Date(), parseInt(selectedMonth)), 'MMMM yyyy')}</h3>
          <p className={`text-2xl font-bold ${getBalanceForMonth(parseInt(selectedMonth)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            €{getBalanceForMonth(parseInt(selectedMonth)).toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Monthly Income</h3>
          <p className="text-2xl font-bold text-green-600">
            €{getRecurringTotalForMonth(true).toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Monthly Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            €{getRecurringTotalForMonth(false).toFixed(2)}
          </p>
        </Card>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {transactions
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 mb-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {transaction.isIncome ? (
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {format(transaction.date, 'PPP')}
                    </p>
                  </div>
                </div>
                <span className={`font-medium ${
                  transaction.isIncome ? 'text-green-600' : 'text-red-600'
                }`}>
                  €{transaction.amount.toFixed(2)}
                </span>
              </div>
            ))}
        </ScrollArea>
      </Card>

      <RunwayChart data={calculateRunway()} />
    </div>
  );
};

export default Index;
