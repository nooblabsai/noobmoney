import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  t: (key: string) => string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  el: {
    'financial.runway.calculator': 'Υπολογιστής Οικονομικής Διάρκειας',
    'export.pdf': 'Εξαγωγή PDF',
    'reset.data': 'Επαναφορά Δεδομένων',
    'are.you.sure': 'Είστε σίγουροι;',
    'this.will.delete': 'Αυτό θα διαγράψει όλα τα δεδομένα σας.',
    'no': 'Όχι',
    'yes.proceed': 'Ναι, συνέχεια',
    'bank.balance': 'Υπόλοιπο Τράπεζας',
    'debt.balance': 'Υπόλοιπο Χρέους',
    'net.worth': 'Καθαρή Αξία',
    'add.transaction': 'Προσθήκη Συναλλαγής',
    'amount': 'Ποσό',
    'description': 'Περιγραφή',
    'date': 'Ημερομηνία',
    'income': 'Έσοδα',
    'expense': 'Έξοδα',
    'processing': 'Επεξεργασία...',
    'add.income': 'Προσθήκη Εσόδων',
    'add.expense': 'Προσθήκη Εξόδων',
    'enter.amount': 'Εισάγετε ποσό',
    'enter.description': 'Εισάγετε περιγραφή',
    'pick.date': 'Επιλέξτε ημερομηνία',
    'monthly': 'Μηνιαία',
    'delete': 'Διαγραφή',
    'recurring.from': 'Επαναλαμβανόμενο από',
    'transaction.deleted': 'Η συναλλαγή διαγράφηκε',
    'recurring.deleted': 'Η επαναλαμβανόμενη συναλλαγή διαγράφηκε',
    'data.loaded': 'Τα δεδομένα φορτώθηκαν',
    'data.loaded.success': 'Τα δεδομένα φορτώθηκαν με επιτυχία',
    'pdf.exported': 'Το PDF εξήχθη',
    'pdf.exported.success': 'Το PDF εξήχθη με επιτυχία',
    'pdf.export.failed': 'Η εξαγωγή PDF απέτυχε',
    'pdf.export.failed.description': 'Παρουσιάστηκε σφάλμα κατά την εξαγωγή του PDF',
    'data.reset': 'Επαναφορά δεδομένων',
    'data.reset.success': 'Τα δεδομένα επαναφέρθηκαν με επιτυχία',
    'select.month': 'Επιλέξτε μήνα',
    'balance.for': 'Υπόλοιπο για',
    'monthly.recurring.income': 'Μηνιαία Επαναλαμβανόμενα Έσοδα',
    'monthly.recurring.expenses': 'Μηνιαία Επαναλαμβανόμενα Έξοδα',
    'transaction.history': 'Ιστορικό Συναλλαγών',
    'all.time': 'Όλες οι περίοδοι',
    'show.selected.month': 'Εμφάνιση επιλεγμένου μήνα',
    'show.all.transactions': 'Εμφάνιση όλων των συναλλαγών',
    'no.transactions': 'Δεν υπάρχουν συναλλαγές',
    'financial.runway': 'Οικονομική Διάρκεια',
    'with.initial.balances': 'Με αρχικά υπόλοιπα',
    'without.initial.balances': 'Χωρίς αρχικά υπόλοιπα',
    'balance': 'Υπόλοιπο',
    'expenses': 'Έξοδα',
    'financial.analysis': 'Οικονομική Ανάλυση',
    'analyzing': 'Ανάλυση...',
    'generate.analysis': 'Δημιουργία Ανάλυσης',
    'openai.api.key.title': 'Κλειδί API OpenAI',
    'openai.api.key.description': 'Εισάγετε το κλειδί API του OpenAI για να δημιουργήσετε την ανάλυση',
    'save.and.continue': 'Αποθήκευση και συνέχεια',
    'expenses.by.category': 'Έξοδα ανά κατηγορία',
    'housing': 'Στέγαση',
    'food': 'Τρόφιμα',
    'transportation': 'Μεταφορές',
    'healthcare': 'Υγεία',
    'entertainment': 'Ψυχαγωγία',
    'shopping': 'Αγορές',
    'utilities': 'Λογαριασμοί',
    'education': 'Εκπαίδευση',
    'travel': 'Ταξίδια',
    'other': 'Άλλα',
    'recurring.transactions': 'Επαναλαμβανόμενες Συναλλαγές',
    'monthly.amount': 'Μηνιαίο Ποσό',
    'enter.monthly.amount': 'Εισάγετε μηνιαίο ποσό',
    'start.date': 'Ημερομηνία Έναρξης',
    'add.recurring': 'Προσθήκη Επαναλαμβανόμενης',
    'add.recurring.income': 'Προσθήκη Επαναλαμβανόμενου Εσόδου',
    'add.recurring.expense': 'Προσθήκη Επαναλαμβανόμενου Εξόδου'
  },
  en: {
    'financial.runway.calculator': 'Financial Runway Calculator',
    'export.pdf': 'Export PDF',
    'reset.data': 'Reset Data',
    'are.you.sure': 'Are you sure?',
    'this.will.delete': 'This will delete all your data.',
    'no': 'No',
    'yes.proceed': 'Yes, proceed',
    'bank.balance': 'Bank Balance',
    'debt.balance': 'Debt Balance',
    'net.worth': 'Net Worth',
    'add.transaction': 'Add Transaction',
    'amount': 'Amount',
    'description': 'Description',
    'date': 'Date',
    'income': 'Income',
    'expense': 'Expense',
    'processing': 'Processing...',
    'add.income': 'Add Income',
    'add.expense': 'Add Expense',
    'enter.amount': 'Enter amount',
    'enter.description': 'Enter description',
    'pick.date': 'Pick a date',
    'monthly': 'Monthly',
    'delete': 'Delete',
    'recurring.from': 'Recurring from',
    'transaction.deleted': 'Transaction deleted',
    'recurring.deleted': 'Recurring transaction deleted',
    'data.loaded': 'Data loaded',
    'data.loaded.success': 'Data loaded successfully',
    'pdf.exported': 'PDF exported',
    'pdf.exported.success': 'PDF exported successfully',
    'pdf.export.failed': 'PDF export failed',
    'pdf.export.failed.description': 'An error occurred while exporting the PDF',
    'data.reset': 'Data reset',
    'data.reset.success': 'Data reset successfully',
    'select.month': 'Select month',
    'balance.for': 'Balance for',
    'monthly.recurring.income': 'Monthly Recurring Income',
    'monthly.recurring.expenses': 'Monthly Recurring Expenses',
    'transaction.history': 'Transaction History',
    'all.time': 'All time',
    'show.selected.month': 'Show selected month',
    'show.all.transactions': 'Show all transactions',
    'no.transactions': 'No transactions',
    'financial.runway': 'Financial Runway',
    'with.initial.balances': 'With initial balances',
    'without.initial.balances': 'Without initial balances',
    'balance': 'Balance',
    'expenses': 'Expenses',
    'financial.analysis': 'Financial Analysis',
    'analyzing': 'Analyzing...',
    'generate.analysis': 'Generate Analysis',
    'openai.api.key.title': 'OpenAI API Key',
    'openai.api.key.description': 'Enter your OpenAI API key to generate the analysis',
    'save.and.continue': 'Save and continue',
    'expenses.by.category': 'Expenses by Category',
    'housing': 'Housing',
    'food': 'Food',
    'transportation': 'Transportation',
    'healthcare': 'Healthcare',
    'entertainment': 'Entertainment',
    'shopping': 'Shopping',
    'utilities': 'Utilities',
    'education': 'Education',
    'travel': 'Travel',
    'other': 'Other',
    'recurring.transactions': 'Recurring Transactions',
    'monthly.amount': 'Monthly Amount',
    'enter.monthly.amount': 'Enter monthly amount',
    'start.date': 'Start Date',
    'add.recurring': 'Add Recurring',
    'add.recurring.income': 'Add Recurring Income',
    'add.recurring.expense': 'Add Recurring Expense'
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
