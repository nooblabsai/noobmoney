import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

interface ExpenseFormProps {
  onSubmit: (amount: number, description: string, isIncome: boolean) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isIncome, setIsIncome] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    onSubmit(parseFloat(amount), description, isIncome);
    setAmount('');
    setDescription('');
  };

  return (
    <Card className="p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
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
          Add {isIncome ? 'Income' : 'Expense'}
        </Button>
      </form>
    </Card>
  );
};

export default ExpenseForm;