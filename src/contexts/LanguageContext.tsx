import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  t: (key: string, params?: Record<string, string>) => string;
  setLanguage: (lang: string) => void;
  language: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'app.name': 'Financial Planner',
    'welcome': 'Welcome to Financial Planner',
    'first.time.setup': 'Let\'s set up your account to get started.',
    'enter.name': 'Enter your name',
    'enter.email': 'Enter your email',
    'enter.password': 'Enter your password',
    'enter.openai.key': 'Enter your OpenAI API key',
    'creating.account': 'Creating account...',
    'create.account': 'Create Account',
    'account.created': 'Account created successfully!',
    'account.creation.failed': 'Failed to create account. Please try again.',
    'fill.required.fields': 'Please fill in all required fields',
    'openai.key': 'OpenAI API Key',
    'update.openai.key': 'Update OpenAI Key',
    'openai.key.description': 'Enter your OpenAI API key to enable AI-powered financial analysis',
    'openai.key.saved': 'OpenAI key saved successfully!',
    'openai.key.save.failed': 'Failed to save OpenAI key. Please try again.',
    'saving': 'Saving...',
    'save': 'Save',
    'error': 'Error',
    'success': 'Success',
    'name': 'Name',
    'email': 'Email',
    'password': 'Password',
    'optional': 'Optional',
    'welcome.user': 'Welcome, {name}',
    'current.bank.balance': 'Current Bank Balance',
    'current.debt.balance': 'Current Debt Balance',
    'financial.runway.calculator': 'Financial Runway Calculator',
    'financial.runway.with.balances': 'Financial Runway (with initial balances)',
    'financial.runway.without.balances': 'Financial Runway (without initial balances)',
    'export.pdf': 'Export PDF',
    'reset.data': 'Reset Data',
    'financial.analysis': 'Financial Analysis',
    'analyzing': 'Analyzing...',
    'generate.analysis': 'Generate Analysis',
    'login.required': 'Please log in to use this feature',
    'save.and.continue': 'Save and Continue',
    'openai.api.key.title': 'OpenAI API Key Required',
    'openai.api.key.description': 'Please enter your OpenAI API key to continue',
    'welcome.back': 'Welcome Back',
    'sign.in': 'Sign in to your account',
    'create.account.start': 'Create an account to get started',
    'signing.in': 'Signing in...',
    'sign.in.button': 'Sign In',
    'need.account': 'Need an account? Sign Up',
    'have.account': 'Already have an account? Sign In',
    'login.success': 'Successfully logged in!',
    'login.failed': 'Login failed',
  },
  el: {
    'app.name': 'Οικονομικός Σχεδιαστής',
    'welcome': 'Καλώς ήρθατε στον Οικονομικό Σχεδιαστή',
    'first.time.setup': 'Ας ρυθμίσουμε τον λογαριασμό σας για να ξεκινήσουμε.',
    'enter.name': 'Εισάγετε το όνομά σας',
    'enter.email': 'Εισάγετε το email σας',
    'enter.password': 'Εισάγετε τον κωδικό σας',
    'enter.openai.key': 'Εισάγετε το κλειδί API του OpenAI',
    'creating.account': 'Δημιουργία λογαριασμού...',
    'create.account': 'Δημιουργία Λογαριασμού',
    'account.created': 'Ο λογαριασμός δημιουργήθηκε με επιτυχία!',
    'account.creation.failed': 'Αποτυχία δημιουργίας λογαριασμού. Παρακαλώ δοκιμάστε ξανά.',
    'fill.required.fields': 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία',
    'openai.key': 'Κλειδί API OpenAI',
    'update.openai.key': 'Ενημέρωση Κλειδιού OpenAI',
    'openai.key.description': 'Εισάγετε το κλειδί API του OpenAI για να ενεργοποιήσετε την AI-powered οικονομική ανάλυση',
    'openai.key.saved': 'Το κλειδί OpenAI αποθηκεύτηκε με επιτυχία!',
    'openai.key.save.failed': 'Αποτυχία αποθήκευσης κλειδιού OpenAI. Παρακαλώ δοκιμάστε ξανά.',
    'saving': 'Αποθήκευση...',
    'save': 'Αποθήκευση',
    'error': 'Σφάλμα',
    'success': 'Επιτυχία',
    'name': 'Όνομα',
    'email': 'Email',
    'password': 'Κωδικός',
    'optional': 'Προαιρετικό',
    'welcome.user': 'Καλώς ήρθατε, {name}',
    'current.bank.balance': 'Τρέχον Υπόλοιπο Τράπεζας',
    'current.debt.balance': 'Τρέχον Υπόλοιπο Χρέους',
    'financial.runway.calculator': 'Υπολογιστής Οικονομικής Διαδρομής',
    'financial.runway.with.balances': 'Οικονομική Διαδρομή (με αρχικά υπόλοιπα)',
    'financial.runway.without.balances': 'Οικονομική Διαδρομή (χωρίς αρχικά υπόλοιπα)',
    'export.pdf': 'Εξαγωγή PDF',
    'reset.data': 'Επαναφορά Δεδομένων',
    'financial.analysis': 'Οικονομική Ανάλυση',
    'analyzing': 'Ανάλυση...',
    'generate.analysis': 'Δημιουργία Ανάλυσης',
    'login.required': 'Παρακαλώ συνδεθείτε για να χρησιμοποιήσετε αυτή τη λειτουργία',
    'save.and.continue': 'Αποθήκευση και Συνέχεια',
    'openai.api.key.title': 'Απαιτείται Κλειδί API OpenAI',
    'openai.api.key.description': 'Παρακαλώ εισάγετε το κλειδί API του OpenAI για να συνεχίσετε',
    'welcome.back': 'Καλώς Ήρθατε Ξανά',
    'sign.in': 'Συνδεθείτε στον λογαριασμό σας',
    'create.account.start': 'Δημιουργήστε λογαριασμό για να ξεκινήσετε',
    'signing.in': 'Σύνδεση...',
    'sign.in.button': 'Σύνδεση',
    'need.account': 'Χρειάζεστε λογαριασμό; Εγγραφή',
    'have.account': 'Έχετε ήδη λογαριασμό; Σύνδεση',
    'login.success': 'Επιτυχής σύνδεση!',
    'login.failed': 'Η σύνδεση απέτυχε',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string, params?: Record<string, string>) => {
    let text = translations[language][key] || key;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(`{${key}}`, value);
      });
    }
    return text;
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
