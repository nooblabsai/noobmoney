import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import LanguageMenu from './LanguageMenu';
import UserMenu from './UserMenu';

interface HeaderSectionProps {
  t: (key: string) => string;
  handleExportPDF: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ t, handleExportPDF }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-center">{t('app.name')}</h1>
      <div className="flex items-center gap-4">
        <Button onClick={handleExportPDF} className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          {t('export.pdf')}
        </Button>
        <UserMenu />
        <LanguageMenu />
      </div>
    </div>
  );
};