import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Repeat, Trash2, Tag, Edit, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { Transaction } from '@/types/transactions';

interface TransactionItemProps {
  transaction: Transaction & { isRecurring?: boolean };
  onDelete: (id: string, isRecurring: boolean) => void;
  onEdit: (id: string, newAmount: number, isRecurring: boolean) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onDelete,
  onEdit,
}) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(transaction.amount.toString());

  const handleSave = () => {
    const newAmount = parseFloat(editAmount);
    if (!isNaN(newAmount) && newAmount > 0) {
      onEdit(transaction.id, newAmount, transaction.isRecurring || false);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="flex items-center justify-between p-3 mb-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {transaction.isIncome ? (
            <ArrowUpCircle className="h-5 w-5 text-green-500" />
          ) : (
            <ArrowDownCircle className="h-5 w-5 text-red-500" />
          )}
          {transaction.isRecurring && (
            <Repeat className="h-4 w-4 text-blue-500" />
          )}
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500">
              {format(new Date(transaction.date), 'PPP')}
            </p>
            {!transaction.isIncome && transaction.category && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {t(`category.${transaction.category}`)}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-24"
              min="0"
              step="0.01"
              autoFocus
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSave}
              className="h-8 w-8"
            >
              <Check className="h-4 w-4 text-green-500" />
            </Button>
          </div>
        ) : (
          <>
            <span className={`font-medium ${
              transaction.isIncome ? 'text-green-600' : 'text-red-600'
            }`}>
              €{transaction.amount.toFixed(2)}
            </span>
            <button
              onClick={() => {
                setEditAmount(transaction.amount.toString());
                setIsEditing(true);
              }}
              className="text-gray-400 hover:text-blue-500 transition-colors"
              aria-label={t('edit')}
            >
              <Edit className="h-4 w-4" />
            </button>
          </>
        )}
        <button
          onClick={() => onDelete(transaction.id, transaction.isRecurring || false)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label={t('delete')}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;