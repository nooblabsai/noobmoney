import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RecurringTransactionFormProps {
  amount: string;
  setAmount: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  isIncome: boolean;
  setIsIncome: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const RecurringTransactionForm: React.FC<RecurringTransactionFormProps> = ({
  amount,
  setAmount,
  description,
  setDescription,
  isIncome,
  setIsIncome,
  onSubmit,
}) => {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="space-y-4 mb-6">
      <div className="space-y-2">
        <Label htmlFor="recurring-amount">{t('monthly.amount')}</Label>
        <Input
          id="recurring-amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={t('enter.monthly.amount')}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="recurring-description">{t('description')}</Label>
        <Input
          id="recurring-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('enter.description')}
          className="w-full"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant={isIncome ? "default" : "outline"}
          onClick={() => setIsIncome(true)}
          className="w-1/2"
        >
          {t('income')}
        </Button>
        <Button
          type="button"
          variant={!isIncome ? "default" : "outline"}
          onClick={() => setIsIncome(false)}
          className="w-1/2"
        >
          {t('expense')}
        </Button>
      </div>
      <Button type="submit" className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" />
        {t('add.recurring')} {isIncome ? t('income') : t('expense')}
      </Button>
    </form>
  );
};

export default RecurringTransactionForm;