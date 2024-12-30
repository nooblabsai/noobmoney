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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!openaiKey) {
        toast({
          title: t('error'),
          description: t('enter.openai.key'),
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
        description: t('openai.key.saved'),
      });
      
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error saving OpenAI key:', error);
      toast({
        title: t('error'),
        description: error.message || t('openai.key.save.failed'),
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
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Key className="h-4 w-4" />
        {t('update.openai.key')}
      </Button>

      <Dialog open={isOpen} onOpenChange={() => !isLoading && setIsOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('update.openai.key')}</DialogTitle>
            <DialogDescription>
              {t('openai.key.description')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">{t('openai.key')}</Label>
              <Input
                id="openai-key"
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder={t('enter.openai.key')}
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