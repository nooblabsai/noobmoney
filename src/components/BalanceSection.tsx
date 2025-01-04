import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Euro } from 'lucide-react';

interface BalanceSectionProps {
  bankBalance: string;
  setBankBalance: (value: string) => void;
  debtBalance: string;
  setDebtBalance: (value: string) => void;
  t: (key: string) => string;
}

export const BalanceSection: React.FC<BalanceSectionProps> = ({
  bankBalance,
  setBankBalance,
  debtBalance,
  setDebtBalance,
  t,
}) => {
  const handleBalanceChange = (value: string, type: 'bank' | 'debt') => {
    if (type === 'bank') {
      setBankBalance(value);
    } else {
      setDebtBalance(value);
    }
    // Dispatch event for sync status
    window.dispatchEvent(new Event('balanceUpdated'));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Euro className="h-5 w-5" />
          <h2 className="text-xl font-semibold">{t('bank.balance')}</h2>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bankBalance">{t('current.balance')}</Label>
          <Input
            id="bankBalance"
            type="number"
            value={bankBalance}
            onChange={(e) => handleBalanceChange(e.target.value, 'bank')}
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Euro className="h-5 w-5" />
          <h2 className="text-xl font-semibold">{t('debt.balance')}</h2>
        </div>
        <div className="space-y-2">
          <Label htmlFor="debtBalance">{t('current.debt')}</Label>
          <Input
            id="debtBalance"
            type="number"
            value={debtBalance}
            onChange={(e) => handleBalanceChange(e.target.value, 'debt')}
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </Card>
    </div>
  );
};