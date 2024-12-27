import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'el' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  el: {
    'financial.runway.calculator': 'Υπολογιστής Οικονομικής Διάρκειας',
    'add.transaction': 'Προσθήκη Συναλλαγής',
    'amount': 'Ποσό',
    'description': 'Περιγραφή',
    'date': 'Ημερομηνία',
    'income': 'Έσοδα',
    'expense': 'Έξοδα',
    'add': 'Προσθήκη',
    'reset.data': 'Επαναφορά Δεδομένων',
    'monthly.stats': 'Μηνιαία Στατιστικά',
    'balance': 'Υπόλοιπο',
    'monthly.recurring.income': 'Μηνιαία Επαναλαμβανόμενα Έσοδα',
    'monthly.recurring.expenses': 'Μηνιαία Επαναλαμβανόμενα Έξοδα',
    'transaction.history': 'Ιστορικό Συναλλαγών',
    'financial.analysis': 'Οικονομική Ανάλυση',
    'generate.analysis': 'Δημιουργία Ανάλυσης',
    'analyzing': 'Ανάλυση...',
    'pick.date': 'Επιλέξτε ημερομηνία',
    'select.month': 'Επιλέξτε μήνα',
    'for': 'για',
    'recurring.transactions': 'Επαναλαμβανόμενες Συναλλαγές',
    'monthly.amount': 'Μηνιαίο Ποσό',
    'enter.monthly.amount': 'Εισάγετε μηνιαίο ποσό',
    'enter.description': 'Εισάγετε περιγραφή',
    'add.recurring': 'Προσθήκη Επαναλαμβανόμενης',
    'delete': 'Διαγραφή',
    'income.added': 'Προστέθηκαν Έσοδα',
    'expense.added': 'Προστέθηκαν Έξοδα',
    'recurring.added': 'Προστέθηκε Επαναλαμβανόμενη Συναλλαγή',
    'transaction.deleted': 'Η Συναλλαγή Διαγράφηκε',
    'recurring.deleted': 'Η Επαναλαμβανόμενη Συναλλαγή Διαγράφηκε',
    'reset.complete': 'Η Επαναφορά Ολοκληρώθηκε',
    'data.cleared': 'Όλα τα δεδομένα έχουν διαγραφεί',
    'monthly': 'μηνιαία',
    'balance.for': 'Υπόλοιπο για',
    'recurring.from': 'επαναλαμβανόμενη από',
    'financial.runway': 'Οικονομική Διάρκεια',
    'current.bank.balance': 'Τρέχον Υπόλοιπο Τράπεζας',
    'start.date': 'Ημερομηνία Έναρξης',
  },
  en: {
    'financial.runway.calculator': 'Financial Runway Calculator',
    'add.transaction': 'Add Transaction',
    'amount': 'Amount',
    'description': 'Description',
    'date': 'Date',
    'income': 'Income',
    'expense': 'Expense',
    'add': 'Add',
    'reset.data': 'Reset Data',
    'monthly.stats': 'Monthly Stats',
    'balance': 'Balance',
    'monthly.recurring.income': 'Monthly Recurring Income',
    'monthly.recurring.expenses': 'Monthly Recurring Expenses',
    'transaction.history': 'Transaction History',
    'financial.analysis': 'Financial Analysis',
    'generate.analysis': 'Generate Analysis',
    'analyzing': 'Analyzing...',
    'pick.date': 'Pick a date',
    'select.month': 'Select month',
    'for': 'for',
    'recurring.transactions': 'Recurring Transactions',
    'monthly.amount': 'Monthly Amount',
    'enter.monthly.amount': 'Enter monthly amount',
    'enter.description': 'Enter description',
    'add.recurring': 'Add Recurring',
    'delete': 'Delete',
    'income.added': 'Income Added',
    'expense.added': 'Expense Added',
    'recurring.added': 'Recurring Transaction Added',
    'transaction.deleted': 'Transaction Deleted',
    'recurring.deleted': 'Recurring Transaction Deleted',
    'reset.complete': 'Reset Complete',
    'data.cleared': 'All data has been cleared',
    'monthly': 'monthly',
    'balance.for': 'Balance for',
    'recurring.from': 'recurring from',
    'financial.runway': 'Financial Runway',
    'current.bank.balance': 'Current Bank Balance',
    'start.date': 'Start Date',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'el';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};