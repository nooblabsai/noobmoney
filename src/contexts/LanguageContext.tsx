import React, { createContext, useContext, useState, ReactNode } from 'react';
import enTranslations from '../translations/en';
import elTranslations from '../translations/el';
import { Language, TranslationKey } from '../translations/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
}

const translations = {
  en: enTranslations,
  el: elTranslations,
} as const;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('el');

  const t = (key: TranslationKey, params?: Record<string, string>): string => {
    const translatedText = translations[language][key] || key;
    
    if (params) {
      return Object.entries(params).reduce(
        (text, [paramKey, value]) => text.replace(`{${paramKey}}`, value),
        translatedText
      );
    }
    
    return translatedText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};