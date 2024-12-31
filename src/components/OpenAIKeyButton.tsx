import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Key } from 'lucide-react';
import { supabase } from '@/services/supabaseService';

const OpenAIKeyButton = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        title: t('error'),
        description: t('login_required'),
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        return;
      }

      if (!openaiKey) {
        toast({
          title: t('error'),
          description: t('enter_openai_key'),
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase.functions.invoke('set-secret', {
        body: { key: 'OPENAI_API_KEY', value: openaiKey },
      });

      if (error) {
        throw error;
      }

      toast({
        title: t('success'),
        description: t('openai_key_saved'),
      });
      
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error saving OpenAI key:', error);
      toast({
        title: t('error'),
        description: error.message || t('openai_key_save_failed'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={async () => {
          const isAuthenticated = await checkAuth();
          if (isAuthenticated) {
            setIsOpen(true);
          }
        }}
        className="flex items-center gap-2"
      >
        <Key className="h-4 w-4" />
        {t('update_openai_key')}
      </Button>

      <Dialog open={isOpen} onOpenChange={() => !isLoading && setIsOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('update_openai_key')}</DialogTitle>
            <DialogDescription>
              {t('openai_key_description')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {isLoading ? t('saving') : t('save')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OpenAIKeyButton;