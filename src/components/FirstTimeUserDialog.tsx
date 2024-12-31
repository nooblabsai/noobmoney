import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signUpUser, signInUser } from '@/services/supabaseService';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

interface FirstTimeUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const FirstTimeUserDialog: React.FC<FirstTimeUserDialogProps> = ({ isOpen, onComplete }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        if (!email || !password) {
          toast({
            title: t('error'),
            description: t('fill.required'),
            variant: 'destructive',
          });
          return;
        }

        const data = await signInUser(email, password);
        if (!data.user) {
          throw new Error(t('invalid.credentials'));
        }
      } else {
        if (!name || !email || !password) {
          toast({
            title: t('error'),
            description: t('fill.required'),
            variant: 'destructive',
          });
          return;
        }

        const data = await signUpUser(email, password, name);
        if (!data.user) {
          throw new Error(t('account.creation.failed'));
        }

        if (openaiKey.trim()) {
          const { error: settingsError } = await supabase
            .from('user_settings')
            .upsert({
              user_id: data.user.id,
              openai_api_key: openaiKey
            }, {
              onConflict: 'user_id'
            });

          if (settingsError) {
            console.error('Failed to save OpenAI key:', settingsError);
          }
        }
      }

      toast({
        title: t('success'),
        description: isLogin ? t('login.success') : t('account.created'),
      });
      
      onComplete();
    } catch (error: any) {
      console.error('Error:', error);
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
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLogin ? t('welcome.back') : t('welcome')}</DialogTitle>
          <DialogDescription>
            {isLogin ? t('sign.in.description') : t('create.account.description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">{t('name')} *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('enter.name')}
                disabled={isLoading}
                required={!isLogin}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')} *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('enter.email')}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')} *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('enter.password')}
              disabled={isLoading}
              required
            />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="openai-key">{t('openai.key.optional')}</Label>
              <Input
                id="openai-key"
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder={t('enter.openai.key')}
                disabled={isLoading}
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('processing') : (isLogin ? t('sign.in') : t('create.account'))}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
            disabled={isLoading}
          >
            {isLogin ? t('need.account') : t('have.account')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeUserDialog;