import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signUpUser, signInUser, saveTransactions } from '@/services/supabaseService';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
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
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setUserId(user?.id || null);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUserId(null);
      // Clear local storage
      localStorage.clear();
      toast({
        title: t('success'),
        description: t('logout.success'),
      });
      // Reload the page to clear all data
      window.location.reload();
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: t('error'),
        description: t('logout.failed'),
        variant: 'destructive',
      });
    }
  };

  const handleSaveData = async () => {
    if (!isLoggedIn || !userId) return;
    
    try {
      toast({
        title: t('saving'),
        description: t('saving.description'),
      });

      await saveTransactions(userId, transactions, recurringTransactions, bankBalance, debtBalance);

      toast({
        title: t('success'),
        description: t('data.saved'),
      });
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: t('error'),
        description: error.message || t('save.failed'),
        variant: 'destructive',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email || !password || (isSignUp && !name)) {
        toast({
          title: t('error'),
          description: t('fill.required'),
          variant: 'destructive',
        });
        return;
      }

      let user;
      try {
        if (isSignUp) {
          const result = await signUpUser(email, password, name);
          user = result.user;
          if (!user) throw new Error(t('account.creation.failed'));
        } else {
          const result = await signInUser(email, password);
          user = result.user;
          if (!user) throw new Error(t('invalid.credentials'));
        }
      } catch (authError: any) {
        if (authError.message === 'User already registered') {
          throw new Error(t('account.exists'));
        }
        if (authError.message === 'Invalid login credentials') {
          throw new Error(t('invalid.credentials'));
        }
        throw authError;
      }

      setIsLoggedIn(true);
      setUserId(user.id);
      await saveTransactions(user.id, transactions, recurringTransactions, bankBalance, debtBalance);

      toast({
        title: t('success'),
        description: isSignUp ? t('account.created') : t('login.success'),
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: t('error'),
        description: error.message || (isSignUp ? t('account.creation.failed') : t('login.failed')),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <>
          <Button onClick={handleSaveData} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {t('save.data')}
          </Button>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            {t('logout')}
          </Button>
        </>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {t('save.data')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isSignUp ? t('create.account') : t('sign.in')}</DialogTitle>
              <DialogDescription>
                {isSignUp 
                  ? t('create.account.description')
                  : t('sign.in.description')
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('enter.name')}
                    required={isSignUp}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('enter.email')}
                  required
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
                />
              </div>
              <Button type="submit" className="w-full">
                {isSignUp ? t('sign.up.save') : t('sign.in.save')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? t('have.account') : t('need.account')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SaveDataButton;