import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle, CalendarIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { autoTagExpense } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';

interface RecurringTransactionFormProps {
  amount: string;
  setAmount: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  isIncome: boolean;
  setIsIncome: (value: boolean) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const RecurringTransactionForm: React.FC<RecurringTransactionFormProps> = ({
  amount,
  setAmount,
  description,
  setDescription,
  isIncome,
  setIsIncome,
  startDate,
  setStartDate,
  onSubmit,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    setIsSubmitting(true);
    try {
      if (!isIncome) {
        const category = await autoTagExpense(description);
        toast({
          title: t('expense.categorized'),
          description: `${t('category')}: ${t(category)}`,
        });
      }

      await onSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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
          required
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
          required
        />
      </div>
      <div className="space-y-2">
        <Label>{t('start.date')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>{t('pick.date')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && setStartDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
      <Button disabled={isSubmitting} type="submit" className="w-full">
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <PlusCircle className="mr-2 h-4 w-4" />
        )}
        {isSubmitting ? t('processing') : `${t('add.recurring')} ${isIncome ? t('income') : t('expense')}`}
      </Button>
    </form>
  );
};

export default RecurringTransactionForm;