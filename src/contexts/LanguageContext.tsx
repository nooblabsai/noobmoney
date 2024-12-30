import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  t: (key: string) => string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    welcome: 'Welcome to Finance Tracker',
    first.time.setup: 'Let\'s set up your account to enable transaction categorization and data saving.',
    enter.name: 'Enter your name',
    enter.email: 'Enter your email',
    enter.password: 'Enter your password',
    enter.openai.key: 'Enter your OpenAI API key',
    creating.account: 'Creating account...',
    create.account: 'Create Account',
    account.created: 'Account created successfully!',
    account.creation.failed: 'Failed to create account. Please try again.',
    fill.all.fields: 'Please fill in all fields',
    openai.key: 'OpenAI API Key',
    update.openai.key: 'Update OpenAI Key',
    openai.key.description: 'Enter your OpenAI API key to enable automatic transaction categorization',
    openai.key.saved: 'OpenAI key saved successfully!',
    openai.key.save.failed: 'Failed to save OpenAI key. Please try again.',
    saving: 'Saving...',
    save: 'Save',
  },
  el: {
    welcome: 'Καλώς ήρθατε στο Finance Tracker',
    first.time.setup: 'Ας ρυθμίσουμε τον λογαριασμό σας για να ενεργοποιήσουμε την κατηγοριοποίηση συναλλαγών και την αποθήκευση δεδομένων.',
    enter.name: 'Εισάγετε το όνομά σας',
    enter.email: 'Εισάγετε το email σας',
    enter.password: 'Εισάγετε τον κωδικό σας',
    enter.openai.key: 'Εισάγετε το κλειδί API του OpenAI',
    creating.account: 'Δημιουργία λογαριασμού...',
    create.account: 'Δημιουργία Λογαριασμού',
    account.created: 'Ο λογαριασμός δημιουργήθηκε με επιτυχία!',
    account.creation.failed: 'Αποτυχία δημιουργίας λογαριασμού. Παρακαλώ δοκιμάστε ξανά.',
    fill.all.fields: 'Παρακαλώ συμπληρώστε όλα τα πεδία',
    openai.key: 'Κλειδί API OpenAI',
    update.openai.key: 'Ενημέρωση Κλειδιού OpenAI',
    openai.key.description: 'Εισάγετε το κλειδί API του OpenAI για να ενεργοποιήσετε την αυτόματη κατηγοριοποίηση συναλλαγών',
    openai.key.saved: 'Το κλειδί OpenAI αποθηκεύτηκε με επιτυχία!',
    openai.key.save.failed: 'Αποτυχία αποθήκευσης κλειδιού OpenAI. Παρακαλώ δοκιμάστε ξανά.',
    saving: 'Αποθήκευση...',
    save: 'Αποθήκευση',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t, setLanguage }}>
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
