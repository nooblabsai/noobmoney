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
import { useLanguage } from '@/contexts/LanguageContext';

interface LoadDataButtonProps {
  onDataLoaded: (transactions: any[], recurringTransactions: any[], bankBalance: string, debtBalance: string) => void;
}

const LoadDataButton: React.FC<LoadDataButtonProps> = ({ onDataLoaded }) => {
  const { t } = useLanguage();
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
          title: t('error'),
          description: t('fill.required'),
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: t('loading'),
        description: t('loading.description'),
      });

      const data = await signInUser(email, password);
      
      if (!data.user) {
        throw new Error(t('invalid.credentials'));
      }

      console.log('Loading transactions for user:', data.user.id);
      const { transactions, recurringTransactions, bankBalance, debtBalance } = await loadTransactions(data.user.id);
      
      console.log('Loaded transactions:', transactions);
      console.log('Loaded recurring transactions:', recurringTransactions);
      
      onDataLoaded(transactions, recurringTransactions, bankBalance, debtBalance);

      toast({
        title: t('success'),
        description: t('data.loaded.success'),
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: t('error'),
        description: error.message || t('loading.failed'),
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
          {t('load.data')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('load.data')}</DialogTitle>
          <DialogDescription>
            {t('load.data.description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLoadData} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('enter.email')}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('enter.password')}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('loading') : t('load.data')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoadDataButton;