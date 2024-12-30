import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInUser, loadTransactions } from '@/services/supabaseService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoadDataButtonProps {
  onDataLoaded: (transactions: any[], recurringTransactions: any[], bankBalance: string, debtBalance: string) => void;
}

const LoadDataButton: React.FC<LoadDataButtonProps> = ({ onDataLoaded }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        toast({
          title: 'Error',
          description: 'Please enter both email and password',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Loading Data',
        description: 'Please wait while we load your data...',
      });

      const data = await signInUser(email, password);
      
      if (!data.user) {
        throw new Error('Authentication failed');
      }

      const { transactions, recurringTransactions, bankBalance, debtBalance } = await loadTransactions(data.user.id);
      onDataLoaded(transactions, recurringTransactions, bankBalance, debtBalance);

      toast({
        title: 'Success',
        description: 'Data loaded successfully!',
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: 'Authentication Error',
        description: error.message || 'Failed to load data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Load Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Load Your Data</DialogTitle>
          <DialogDescription>
            Enter your credentials to load your saved data. Make sure you have an account first.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLoadData} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load Data'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoadDataButton;