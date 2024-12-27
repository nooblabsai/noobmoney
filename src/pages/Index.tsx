import React from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import RecurringTransactions from '@/components/RecurringTransactions';
import RunwayChart from '@/components/RunwayChart';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

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
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [recurringTransactions, setRecurringTransactions] = React.useState<RecurringTransaction[]>([]);
  const [currentBalance, setCurrentBalance] = React.useState(0);

  const handleAddTransaction = (amount: number, description: string, isIncome: boolean) => {
    const newTransaction = {
      id: Math.random().toString(),
      amount,
      description,
      isIncome,
      date: new Date(),
    };
    setTransactions([...transactions, newTransaction]);
    setCurrentBalance(prev => prev + (isIncome ? amount : -amount));
    
    toast({
      title: `${isIncome ? 'Income' : 'Expense'} Added`,
      description: `${description}: $${amount.toFixed(2)}`,
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
      description: `${transaction.description}: $${transaction.amount.toFixed(2)} monthly`,
    });
  };

  const handleDeleteRecurringTransaction = (id: string) => {
    setRecurringTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: 'Recurring Transaction Deleted',
    });
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
    let balance = currentBalance;

    for (let i = 0; i < 12; i++) {
      balance += monthlyNet;
      data.push({
        month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }),
        balance: balance,
      });
    }

    return data;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Financial Runway Calculator</h1>
      
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Current Balance</h3>
          <p className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${currentBalance.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Monthly Income</h3>
          <p className="text-2xl font-bold text-green-600">
            ${recurringTransactions.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Monthly Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            ${recurringTransactions.filter(t => !t.isIncome).reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
          </p>
        </Card>
      </div>

      <RunwayChart data={calculateRunway()} />
    </div>
  );
};

export default Index;