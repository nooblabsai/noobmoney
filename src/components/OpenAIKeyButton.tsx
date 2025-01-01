import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const OpenAIKeyButton = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    localStorage.setItem('openai-api-key', apiKey);
    setOpen(false);
    toast({
      title: t('success'),
      description: t('data.saved'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {t('update.openai.key')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('openai.api.key.title')}</DialogTitle>
          <DialogDescription>
            {t('openai.api.key.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder={t('enter.openai.key')}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button onClick={handleSave} className="w-full">
            {t('save.and.continue')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpenAIKeyButton;