import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { autoTagExpense } from '@/services/categoryService';
import { ExpenseCategory } from '@/types/categories';

interface ExpenseFormProps {
  onSubmit: (amount: number, description: string, isIncome: boolean, date: Date, category?: ExpenseCategory) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const { t } = useLanguage();
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isIncome, setIsIncome] = React.useState(false);
  const [date, setDate] = React.useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const category = !isIncome ? await autoTagExpense(description) : undefined;
      onSubmit(parseFloat(amount), description, isIncome, date, category);
      setAmount('');
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">{t('amount')}</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('enter.amount')}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t('description')}</Label>
          <Input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('enter.description')}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label>{t('date')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>{t('pick.date')}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
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
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {isSubmitting ? t('processing') : (isIncome ? t('add.income') : t('add.expense'))}
        </Button>
      </form>
    </Card>
  );
};

export default ExpenseForm;
