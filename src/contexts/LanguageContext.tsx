import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'app.name': 'My App',
    'export.pdf': 'Export PDF',
    'reset.data': 'Reset Data',
    'are.you.sure': 'Are you sure?',
    'this.will.delete': 'This will delete all your data.',
    'no': 'No',
    'yes.proceed': 'Yes, proceed',
    'welcome.user': 'Welcome, {name}!',
    'data.loaded': 'Data Loaded',
    'data.loaded.success': 'Your data has been successfully loaded.',
    'pdf.exported': 'PDF Exported',
    'pdf.exported.success': 'Your PDF has been successfully exported.',
    'pdf.export.failed': 'PDF Export Failed',
    'pdf.export.failed.description': 'There was an error exporting your PDF.',
    'data.reset': 'Data Reset',
    'data.reset.success': 'Your data has been successfully reset.',
    'recurring.deleted': 'Recurring transaction deleted.',
    'transaction.deleted': 'Transaction deleted.',
    'name': 'Name',
    'email': 'Email',
    'password': 'Password',
    'enter.name': 'Enter your name',
    'enter.email': 'Enter your email',
    'enter.password': 'Enter your password',
    'welcome.back': 'Welcome Back!',
    'welcome': 'Welcome!',
    'create.account': 'Create Account',
    'create.account.description': 'Please fill in the details to create an account.',
    'sign.in': 'Sign In',
    'sign.in.description': 'Please enter your credentials to sign in.',
    'success': 'Success',
    'error': 'Error',
    'fill.required': 'Please fill in all required fields.',
    'account.creation.failed': 'Account creation failed.',
    'login.success': 'Login successful.',
    'login.failed': 'Login failed.',
    'account.created': 'Account created successfully.',
    'need.account': 'Need an account? Sign Up',
    'have.account': 'Already have an account? Sign In',
    'saving': 'Saving',
    'saving.description': 'Saving your data...',
    'data.saved': 'Data saved successfully',
    'save.failed': 'Failed to save data',
    'account.exists': 'An account with this email already exists. Please sign in instead.',
    'invalid.credentials': 'Invalid email or password. Please try again.',
    'sign.up.save': 'Sign Up & Save',
    'sign.in.save': 'Sign In & Save',
    'logout': 'Logout',
    'logout.success': 'Successfully logged out',
    'logout.failed': 'Failed to logout',
  },
  el: {
    'app.name': 'Η Εφαρμογή Μου',
    'export.pdf': 'Εξαγωγή PDF',
    'reset.data': 'Επαναφορά Δεδομένων',
    'are.you.sure': 'Είστε σίγουροι;',
    'this.will.delete': 'Αυτό θα διαγράψει όλα τα δεδομένα σας.',
    'no': 'Όχι',
    'yes.proceed': 'Ναι, προχωρήστε',
    'welcome.user': 'Καλώς ήρθατε, {name}!',
    'data.loaded': 'Δεδομένα Φορτώθηκαν',
    'data.loaded.success': 'Τα δεδομένα σας έχουν φορτωθεί με επιτυχία.',
    'pdf.exported': 'PDF Εξαγωγή',
    'pdf.exported.success': 'Το PDF σας έχει εξαγωγεί με επιτυχία.',
    'pdf.export.failed': 'Αποτυχία Εξαγωγής PDF',
    'pdf.export.failed.description': 'Υπήρξε σφάλμα κατά την εξαγωγή του PDF σας.',
    'data.reset': 'Επαναφορά Δεδομένων',
    'data.reset.success': 'Τα δεδομένα σας έχουν επαναφερθεί με επιτυχία.',
    'recurring.deleted': 'Η επαναλαμβανόμενη συναλλαγή διαγράφηκε.',
    'transaction.deleted': 'Η συναλλαγή διαγράφηκε.',
    'name': 'Όνομα',
    'email': 'Email',
    'password': 'Κωδικός',
    'enter.name': 'Εισάγετε το όνομά σας',
    'enter.email': 'Εισάγετε το email σας',
    'enter.password': 'Εισάγετε τον κωδικό σας',
    'welcome.back': 'Καλώς ήρθατε Πίσω!',
    'welcome': 'Καλώς ήρθατε!',
    'create.account': 'Δημιουργία Λογαριασμού',
    'create.account.description': 'Παρακαλώ συμπληρώστε τα στοιχεία για να δημιουργήσετε έναν λογαριασμό.',
    'sign.in': 'Σύνδεση',
    'sign.in.description': 'Παρακαλώ εισάγετε τα στοιχεία σας για να συνδεθείτε.',
    'success': 'Επιτυχία',
    'error': 'Σφάλμα',
    'fill.required': 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.',
    'account.creation.failed': 'Αποτυχία δημιουργίας λογαριασμού.',
    'login.success': 'Η σύνδεση ήταν επιτυχής.',
    'login.failed': 'Αποτυχία σύνδεσης.',
    'account.created': 'Ο λογαριασμός δημιουργήθηκε με επιτυχία.',
    'need.account': 'Χρειάζεστε λογαριασμό; Εγγραφείτε',
    'have.account': 'Έχετε ήδη λογαριασμό; Συνδεθείτε',
    'saving': 'Αποθήκευση',
    'saving.description': 'Αποθήκευση των δεδομένων σας...',
    'data.saved': 'Τα δεδομένα αποθηκεύτηκαν με επιτυχία',
    'save.failed': 'Αποτυχία αποθήκευσης δεδομένων',
    'account.exists': 'Υπάρχει ήδη λογαριασμός με αυτό το email. Παρακαλώ συνδεθείτε.',
    'invalid.credentials': 'Μη έγκυρο email ή κωδικός. Παρακαλώ προσπαθήστε ξανά.',
    'sign.up.save': 'Εγγραφή & Αποθήκευση',
    'sign.in.save': 'Σύνδεση & Αποθήκευση',
    'logout': 'Αποσύνδεση',
    'logout.success': 'Επιτυχής αποσύνδεση',
    'logout.failed': 'Αποτυχία αποσύνδεσης',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string) => {
    return translations[language][key] || key;
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
