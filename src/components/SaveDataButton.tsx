import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { signUpUser, saveTransactions } from '@/services/supabaseService';
import { Transaction, RecurringTransaction } from '@/types/transactions';

interface SaveDataButtonProps {
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
}

const SaveDataButton: React.FC<SaveDataButtonProps> = ({ transactions, recurringTransactions }) => {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      // Sign up the user with the provided credentials
      const { user } = await signUpUser('giwrgws@gmail.com', 'gefgef1414', 'Georgios');
      
      if (!user) {
        throw new Error('Failed to create user');
      }

      // Save the transactions
      await saveTransactions(user.id, transactions, recurringTransactions);

      toast({
        title: 'Success',
        description: 'Data saved successfully!',
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={handleSave} className="flex items-center gap-2">
      <Save className="h-4 w-4" />
      Save Data
    </Button>
  );
};

export default SaveDataButton;