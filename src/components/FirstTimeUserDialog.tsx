import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { signInUser, signUpUser } from '@/services/auth/authService';
import { loadTransactions } from '@/services/transactions/transactionService';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthForm from './auth/AuthForm';
import { supabase } from '@/lib/supabaseClient';

interface FirstTimeUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const FirstTimeUserDialog: React.FC<FirstTimeUserDialogProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let userData;

      if (isLogin) {
        if (!email || !password) {
          toast({
            title: t('error'),
            description: t('fill.required'),
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        userData = await signInUser(email, password);
        console.log('Sign in response:', userData);
        
        if (!userData?.user) {
          throw new Error(t('invalid.credentials'));
        }

        // Load transactions after successful login
        const transactionData = await loadTransactions(userData.user.id);
        console.log('Loaded transaction data:', transactionData);
        
        if (transactionData) {
          const { transactions, recurringTransactions, bankBalance, debtBalance } = transactionData;
          
          localStorage.setItem('transactions', JSON.stringify(transactions || []));
          localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions || []));
          localStorage.setItem('bankBalance', bankBalance?.toString() || '0');
          localStorage.setItem('debtBalance', debtBalance?.toString() || '0');

          window.location.reload();
        }
        
        toast({
          title: t('success'),
          description: t('login.success'),
        });
        
        onComplete();
      } else {
        if (!name || !email || !password) {
          toast({
            title: t('error'),
            description: t('fill.required'),
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        userData = await signUpUser(email, password, name);
        console.log('Sign up response:', userData);
        
        if (!userData?.user) {
          throw new Error(t('account.creation.failed'));
        }

        // Initialize user settings with OpenAI key if provided
        if (userData.user) {
          try {
            const { error: settingsError } = await supabase
              .from('user_settings')
              .insert({
                user_id: userData.user.id,
                openai_api_key: openaiKey || null,
              });

            if (settingsError) {
              console.error('Failed to save OpenAI key:', settingsError);
            }
          } catch (settingsError) {
            console.error('Failed to save OpenAI key:', settingsError);
          }
        }

        toast({
          title: t('success'),
          description: t('account.created'),
        });
        
        onComplete();
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: t('error'),
        description: error.message || (isLogin ? t('login.failed') : t('account.creation.failed')),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLogin ? t('welcome.back') : t('create.account')}</DialogTitle>
          <DialogDescription>
            {isLogin ? t('auth.signin.description') : t('auth.signup.description')}
          </DialogDescription>
        </DialogHeader>
        <AuthForm
          isSignUp={!isLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          name={name}
          setName={setName}
          openaiKey={openaiKey}
          setOpenaiKey={setOpenaiKey}
          handleSave={handleSubmit}
          setIsSignUp={() => setIsLogin(!isLogin)}
          t={t}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeUserDialog;