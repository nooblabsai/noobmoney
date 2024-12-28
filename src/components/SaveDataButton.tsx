import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signUpUser, signInUser, saveTransactions } from '@/services/supabaseService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SaveDataButtonProps {
  transactions: any[];
  recurringTransactions: any[];
  bankBalance: string;
  debtBalance: string;
}

const SaveDataButton: React.FC<SaveDataButtonProps> = ({ 
  transactions, 
  recurringTransactions,
  bankBalance,
  debtBalance
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast({
        title: 'Saving Data',
        description: 'Please wait while we save your data...',
      });

      let user;
      if (isSignUp) {
        const result = await signUpUser(email, password, name);
        user = result.user;
      } else {
        const result = await signInUser(email, password);
        user = result.user;
      }
      
      if (!user) {
        throw new Error('Failed to authenticate');
      }

      // Save the transactions along with balances
      await saveTransactions(user.id, transactions, recurringTransactions, bankBalance, debtBalance);

      toast({
        title: 'Success',
        description: 'Data saved successfully!',
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Create Account' : 'Sign In'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          )}
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
            {isSignUp ? 'Sign Up & Save' : 'Sign In & Save'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDataButton;