import React from 'react';
import LanguageMenu from './LanguageMenu';
import UserMenu from './UserMenu';
import FeedbackDialog from './FeedbackDialog';

interface HeaderSectionProps {
  t: (key: string) => string;
  handleExportPDF: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ t, handleExportPDF }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-center">{t('app.name')}</h1>
      <div className="flex items-center gap-4">
        <UserMenu />
        <FeedbackDialog />
        <LanguageMenu />
      </div>
    </div>
  );
};