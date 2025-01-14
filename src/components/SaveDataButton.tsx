import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AuthForm from './auth/AuthForm';

interface SaveDataButtonProps {
  transactions: any[];
  recurringTransactions: any[];
  bankBalance: string;
  debtBalance: string;
  onReset: () => void;
}

const SaveDataButton: React.FC<SaveDataButtonProps> = ({ 
  transactions, 
  recurringTransactions,
  bankBalance,
  debtBalance,
  onReset
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setUserId(user?.id || null);
    };
    checkUser();
  }, []);

  const handleSaveData = async () => {
    if (!isLoggedIn || !userId) return;
    
    try {
      toast({
        title: t('saving'),
        description: t('saving.description'),
      });

      await saveTransactions(userId, transactions, recurringTransactions, bankBalance, debtBalance);

      // Dispatch event for sync status
      window.dispatchEvent(new Event('dataSynced'));

      toast({
        title: t('success'),
        description: t('data.saved'),
      });
      setShowSaveConfirm(false);
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: t('error'),
        description: error.message || t('save.failed'),
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    onReset();
    setShowResetConfirm(false);
    toast({
      title: t('success'),
      description: t('data.reset'),
    });
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
          <AlertDialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
            <AlertDialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {t('save.data')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('confirm.save')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('confirm.save.description')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleSaveData}>
                  {t('save')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                {t('reset.data')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('confirm.reset')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('confirm.reset.description')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {t('reset')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
            <AuthForm
              isSignUp={isSignUp}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              name={name}
              setName={setName}
              handleSave={handleSave}
              setIsSignUp={setIsSignUp}
              t={t}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SaveDataButton;