import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, PiggyBank } from 'lucide-react';

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
  return (
    <Card className="p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="h-6 w-6 text-primary" />
            <Label htmlFor="bankBalance" className="text-xl font-semibold">
              {t('current.bank.balance')}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-primary">€</span>
            <Input
              id="bankBalance"
              type="text"
              value={bankBalance}
              onChange={(e) => setBankBalance(e.target.value)}
              className="text-4xl font-bold h-16 max-w-xs"
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-4">
            <PiggyBank className="h-6 w-6 text-red-500" />
            <Label htmlFor="debtBalance" className="text-xl font-semibold">
              {t('current.debt.balance')}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-red-500">€</span>
            <Input
              id="debtBalance"
              type="text"
              value={debtBalance}
              onChange={(e) => setDebtBalance(e.target.value)}
              className="text-4xl font-bold h-16 max-w-xs"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};