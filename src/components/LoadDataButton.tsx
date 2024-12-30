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

  const handleLoadData = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const { user, error: signInError } = await signInUser(email, password);
      
      if (signInError || !user) {
        throw new Error(signInError?.message || 'Invalid credentials');
      }

      const { transactions, recurringTransactions, bankBalance, debtBalance } = await loadTransactions(user.id);
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
        description: error.message === 'Invalid login credentials' 
          ? 'Invalid email or password. Please try again.'
          : error.message || 'Failed to load data. Please try again.',
        variant: 'destructive',
      });
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
            Enter your credentials to load your saved data.
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
            />
          </div>
          <Button type="submit" className="w-full">
            Load Data
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoadDataButton;