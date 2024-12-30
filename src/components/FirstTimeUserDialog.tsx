import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signUpUser } from '@/services/supabaseService';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

interface FirstTimeUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const FirstTimeUserDialog: React.FC<FirstTimeUserDialogProps> = ({ isOpen, onClose, onComplete }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!name || !email || !password || !openaiKey) {
        toast({
          title: t('error'),
          description: t('fill_all_fields'),
          variant: 'destructive',
        });
        return;
      }

      const data = await signUpUser(email, password, name);
      
      if (!data.user) {
        throw new Error('Failed to create account');
      }

      // Store OpenAI key in Supabase user_settings table
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: data.user.id,
          openai_api_key: openaiKey
        }, {
          onConflict: 'user_id'
        });

      if (settingsError) {
        throw new Error('Failed to save OpenAI key');
      }

      toast({
        title: t('success'),
        description: t('account_created'),
      });
      
      onComplete();
    } catch (error: any) {
      console.error('Error creating account:', error);
      toast({
        title: t('error'),
        description: error.message || t('account_creation_failed'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('welcome')}</DialogTitle>
          <DialogDescription>
            {t('first_time_setup')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enter_name')}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('enter_email')}
              disabled={isLoading}
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
              placeholder={t('enter_password')}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="openai-key">{t('openai_key')}</Label>
            <Input
              id="openai-key"
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder={t('enter_openai_key')}
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('creating_account') : t('create_account')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeUserDialog;