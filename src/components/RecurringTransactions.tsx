import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle, Repeat } from 'lucide-react';

interface RecurringTransaction {
  id: string;
  amount: number;
  description: string;
  isIncome: boolean;
}

interface RecurringTransactionsProps {
  onAdd: (transaction: Omit<RecurringTransaction, 'id'>) => void;
  transactions: RecurringTransaction[];
  onDelete: (id: string) => void;
}

const RecurringTransactions: React.FC<RecurringTransactionsProps> = ({
  onAdd,
  transactions,
  onDelete,
}) => {
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isIncome, setIsIncome] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    onAdd({
      amount: parseFloat(amount),
      description,
      isIncome,
    });
    setAmount('');
    setDescription('');
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <Repeat className="mr-2 h-5 w-5" />
        <h2 className="text-xl font-semibold">Recurring Transactions</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="recurring-amount">Monthly Amount</Label>
          <Input
            id="recurring-amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter monthly amount"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recurring-description">Description</Label>
          <Input
            id="recurring-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant={isIncome ? "default" : "outline"}
            onClick={() => setIsIncome(true)}
            className="w-1/2"
          >
            Income
          </Button>
          <Button
            type="button"
            variant={!isIncome ? "default" : "outline"}
            onClick={() => setIsIncome(false)}
            className="w-1/2"
          >
            Expense
          </Button>
        </div>
        <Button type="submit" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Recurring {isIncome ? 'Income' : 'Expense'}
        </Button>
      </form>

      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <span className="font-medium">{transaction.description}</span>
              <span className={`ml-2 ${transaction.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                €{transaction.amount.toFixed(2)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(transaction.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecurringTransactions;