import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  t: (key: string, params?: Record<string, string>) => string;
  setLanguage: (lang: string) => void;
  language: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'app.name': 'Noobnation Money',
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
    'financial.analysis': 'AI Agent - Economist',
    'analyzing': 'Analyzing...',
    'generate.analysis': 'Create a financial report',
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
    'monthly.recurring.income': 'Monthly Recurring Income',
    'monthly.recurring.expenses': 'Monthly Recurring Expenses',
    'balance.for': 'Balance for',
    'select.month': 'Select Month',
    'show.selected.month': 'Show Selected Month',
    'show.all.transactions': 'Show All Transactions',
    'all.time': 'All Time',
    'transaction.history': 'Transaction History',
    'no.transactions': 'No transactions found',
    'delete': 'Delete',
    'monthly': 'Monthly',
    'expenses.by.category': 'Expenses by Category',
    'no.categorized.expenses': 'No categorized expenses found',
    'amount': 'Amount',
    'description': 'Description',
    'date': 'Date',
    'pick.date': 'Pick a date',
    'income': 'Income',
    'expense': 'Expense',
    'processing': 'Processing...',
    'add.income': 'Add Income',
    'add.expense': 'Add Expense',
    'enter.amount': 'Enter amount',
    'enter.description': 'Enter description',
    'category': 'Category',
    'income.added': 'Income Added',
    'expense.added': 'Expense Added',
    'income.categorized': 'Income Categorized',
    'expense.categorized': 'Expense Categorized',
    'data.loaded': 'Data Loaded',
    'data.loaded.success': 'Data loaded successfully',
    'pdf.exported': 'PDF Exported',
    'pdf.exported.success': 'PDF exported successfully',
    'pdf.export.failed': 'PDF Export Failed',
    'pdf.export.failed.description': 'Failed to export PDF',
    'data.reset': 'Data Reset',
    'data.reset.success': 'Data reset successfully',
    'are.you.sure': 'Are you sure?',
    'this.will.delete': 'This action cannot be undone.',
    'yes.proceed': 'Yes, proceed',
    'no': 'No',
    'recurring.transactions': 'Recurring Transactions',
    'monthly.amount': 'Monthly Amount',
    'enter.monthly.amount': 'Enter Monthly Amount',
    'start.date': 'Start Date',
    'add.recurring': 'Add Recurring',
    'add.transaction': 'Add Transaction',
    'load.data': 'Load Data',
    'load.data.description': 'Enter your credentials to load your saved data',
  },
  el: {
    'app.name': 'Noobnation Money',
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
    'financial.analysis': 'AI Agent - Οικονομολόγος',
    'analyzing': 'Ανάλυση...',
    'generate.analysis': 'Δημιουργία οικονομικής έκθεσης',
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
    'monthly.recurring.income': 'Μηνιαία Επαναλαμβανόμενα Έσοδα',
    'monthly.recurring.expenses': 'Μηνιαία Επαναλαμβανόμενα Έξοδα',
    'balance.for': 'Υπόλοιπο για',
    'select.month': 'Επιλογή Μήνα',
    'show.selected.month': 'Εμφάνιση Επιλεγμένου Μήνα',
    'show.all.transactions': 'Εμφάνιση Όλων των Συναλλαγών',
    'all.time': 'Όλες οι Περίοδοι',
    'transaction.history': 'Ιστορικό Συναλλαγών',
    'no.transactions': 'Δεν βρέθηκαν συναλλαγές',
    'delete': 'Διαγραφή',
    'monthly': 'Μηνιαία',
    'expenses.by.category': 'Έξοδα ανά Κατηγορία',
    'no.categorized.expenses': 'Δεν βρέθηκαν κατηγοριοποιημένα έξοδα',
    'amount': 'Ποσό',
    'description': 'Περιγραφή',
    'date': 'Ημερομηνία',
    'pick.date': 'Επιλέξτε ημερομηνία',
    'income': 'Έσοδα',
    'expense': 'Έξοδα',
    'processing': 'Επεξεργασία...',
    'add.income': 'Προσθήκη Εσόδων',
    'add.expense': 'Προσθήκη Εξόδων',
    'enter.amount': 'Εισάγετε ποσό',
    'enter.description': 'Εισάγετε περιγραφή',
    'category': 'Κατηγορία',
    'income.added': 'Προστέθηκαν Έσοδα',
    'expense.added': 'Προστέθηκαν Έξοδα',
    'income.categorized': 'Κατηγοριοποιήθηκαν τα Έσοδα',
    'expense.categorized': 'Κατηγοριοποιήθηκαν τα Έξοδα',
    'data.loaded': 'Φόρτωση Δεδομένων',
    'data.loaded.success': 'Τα δεδομένα φορτώθηκαν επιτυχώς',
    'pdf.exported': 'Εξαγωγή PDF',
    'pdf.exported.success': 'Το PDF εξήχθη επιτυχώς',
    'pdf.export.failed': 'Αποτυχία Εξαγωγής PDF',
    'pdf.export.failed.description': 'Αποτυχία εξαγωγής του PDF',
    'data.reset': 'Επαναφορά Δεδομένων',
    'data.reset.success': 'Τα δεδομένα επαναφέρθηκαν επιτυχώς',
    'are.you.sure': 'Είστε σίγουροι;',
    'this.will.delete': 'Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.',
    'yes.proceed': 'Ναι, συνέχεια',
    'no': 'Όχι',
    'recurring.transactions': 'Επαναλαμβανόμενες Συναλλαγές',
    'monthly.amount': 'Μηνιαίο Ποσό',
    'enter.monthly.amount': 'Εισάγετε Μηνιαίο Ποσό',
    'start.date': 'Ημερομηνία Έναρξης',
    'add.recurring': 'Προσθήκη Επαναλαμβανόμενης',
    'add.transaction': 'Προσθήκη Συναλλαγής',
    'load.data': 'Φόρτωση Δεδομένων',
    'load.data.description': 'Εισάγετε τα διαπιστευτήριά σας για να φορτώσετε τα αποθηκευμένα δεδομένα σας',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'el';
  });

  React.useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, params?: Record<string, string>) => {
    let text = translations[language]?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(`{${key}}`, value);
      });
    }
    return text;
  };

  const value = {
    t,
    setLanguage,
    language,
  };

  return (
    <LanguageContext.Provider value={value}>
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
