import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInUser, loadTransactions } from '@/services/supabaseService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoadDataButtonProps {
  onDataLoaded: (transactions: any[], recurringTransactions: any[]) => void;
}

const LoadDataButton: React.FC<LoadDataButtonProps> = ({ onDataLoaded }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleLoadData = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast({
        title: 'Loading Data',
        description: 'Please wait while we load your data...',
      });

      const { user } = await signInUser(email, password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const { transactions, recurringTransactions } = await loadTransactions(user.id);
      onDataLoaded(transactions, recurringTransactions);

      toast({
        title: 'Success',
        description: 'Data loaded successfully!',
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load data. Please try again.',
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