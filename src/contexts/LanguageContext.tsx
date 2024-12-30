import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  t: (key: string) => string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  el: {
    'expenses.by.category': 'Έξοδα ανά κατηγορία',
    'processing': 'Επεξεργασία...',
    'housing': 'Στέγαση',
    'food': 'Τρόφιμα',
    'transportation': 'Μεταφορές',
    'healthcare': 'Υγεία',
    'entertainment': 'Ψυχαγωγία',
    'shopping': 'Αγορές',
    'utilities': 'Λογαριασμοί',
    'education': 'Εκπαίδευση',
    'travel': 'Ταξίδια',
    'other': 'Άλλα'
  },
  en: {
    'expenses.by.category': 'Expenses by Category',
    'processing': 'Processing...',
    'housing': 'Housing',
    'food': 'Food',
    'transportation': 'Transportation',
    'healthcare': 'Healthcare',
    'entertainment': 'Entertainment',
    'shopping': 'Shopping',
    'utilities': 'Utilities',
    'education': 'Education',
    'travel': 'Travel',
    'other': 'Other'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
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
