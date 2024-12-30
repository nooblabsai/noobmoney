import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  t: (key: string) => string;
  setLanguage: (lang: string) => void;
  language: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    welcome: 'Welcome to Finance Tracker',
    first_time_setup: 'Let\'s set up your account to enable transaction categorization and data saving.',
    enter_name: 'Enter your name',
    enter_email: 'Enter your email',
    enter_password: 'Enter your password',
    enter_openai_key: 'Enter your OpenAI API key',
    creating_account: 'Creating account...',
    create_account: 'Create Account',
    account_created: 'Account created successfully!',
    account_creation_failed: 'Failed to create account. Please try again.',
    fill_all_fields: 'Please fill in all fields',
    openai_key: 'OpenAI API Key',
    update_openai_key: 'Update OpenAI Key',
    openai_key_description: 'Enter your OpenAI API key to enable automatic transaction categorization',
    openai_key_saved: 'OpenAI key saved successfully!',
    openai_key_save_failed: 'Failed to save OpenAI key. Please try again.',
    saving: 'Saving...',
    save: 'Save',
    no_categorized_expenses: 'No categorized expenses',
    current_bank_balance: 'Current Bank Balance',
    recurring_transactions: 'Recurring Transactions',
    monthly_amount: 'Monthly Amount',
    add_recurring: 'Add Recurring',
    financial_runway_calculator: 'Financial Runway Calculator',
    export_pdf: 'Export PDF',
    reset_data: 'Reset Data',
    are_you_sure: 'Are you sure?',
    this_will_delete: 'This action will delete all your data.',
    yes_proceed: 'Yes, proceed',
    no: 'No',
    analyzing: 'Analyzing...',
    generate_analysis: 'Generate Analysis',
    financial_analysis: 'Financial Analysis',
    expenses_by_category: 'Expenses by Category'
  },
  el: {
    welcome: 'Καλώς ήρθατε στο Finance Tracker',
    first_time_setup: 'Ας ρυθμίσουμε τον λογαριασμό σας για να ενεργοποιήσουμε την κατηγοριοποίηση συναλλαγών και την αποθήκευση δεδομένων.',
    enter_name: 'Εισάγετε το όνομά σας',
    enter_email: 'Εισάγετε το email σας',
    enter_password: 'Εισάγετε τον κωδικό σας',
    enter_openai_key: 'Εισάγετε το κλειδί API του OpenAI',
    creating_account: 'Δημιουργία λογαριασμού...',
    create_account: 'Δημιουργία Λογαριασμού',
    account_created: 'Ο λογαριασμός δημιουργήθηκε με επιτυχία!',
    account_creation_failed: 'Αποτυχία δημιουργίας λογαριασμού. Παρακαλώ δοκιμάστε ξανά.',
    fill_all_fields: 'Παρακαλώ συμπληρώστε όλα τα πεδία',
    openai_key: 'Κλειδί API OpenAI',
    update_openai_key: 'Ενημέρωση Κλειδιού OpenAI',
    openai_key_description: 'Εισάγετε το κλειδί API του OpenAI για να ενεργοποιήσετε την αυτόματη κατηγοριοποίηση συναλλαγών',
    openai_key_saved: 'Το κλειδί OpenAI αποθηκεύτηκε με επιτυχία!',
    openai_key_save_failed: 'Αποτυχία αποθήκευσης κλειδιού OpenAI. Παρακαλώ δοκιμάστε ξανά.',
    saving: 'Αποθήκευση...',
    save: 'Αποθήκευση',
    no_categorized_expenses: 'Δεν υπάρχουν κατηγοριοποιημένα έξοδα',
    current_bank_balance: 'Τρέχον Υπόλοιπο Τραπέζης',
    recurring_transactions: 'Επαναλαμβανόμενες Συναλλαγές',
    monthly_amount: 'Μηνιαίο Ποσό',
    add_recurring: 'Προσθήκη Επαναλαμβανόμενης',
    financial_runway_calculator: 'Υπολογιστής Οικονομικής Διάρκειας',
    export_pdf: 'Εξαγωγή PDF',
    reset_data: 'Επαναφορά Δεδομένων',
    are_you_sure: 'Είστε σίγουροι;',
    this_will_delete: 'Αυτή η ενέργεια θα διαγράψει όλα τα δεδομένα σας.',
    yes_proceed: 'Ναι, συνέχεια',
    no: 'Όχι',
    analyzing: 'Ανάλυση...',
    generate_analysis: 'Δημιουργία Ανάλυσης',
    financial_analysis: 'Οικονομική Ανάλυση',
    expenses_by_category: 'Έξοδα ανά Κατηγορία'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t, setLanguage, language }}>
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