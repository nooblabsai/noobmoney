import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AlertCircle, CheckCircle } from 'lucide-react';

const SyncStatusBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    const checkLocalStorage = () => {
      const hasTransactions = !!localStorage.getItem('transactions');
      const hasRecurringTransactions = !!localStorage.getItem('recurringTransactions');
      const hasBankBalance = !!localStorage.getItem('bankBalance');
      const hasDebtBalance = !!localStorage.getItem('debtBalance');
      
      setHasLocalData(hasTransactions || hasRecurringTransactions || hasBankBalance || hasDebtBalance);
    };

    // Custom event handler for data changes
    const handleDataChange = () => {
      setHasUnsavedChanges(true);
      checkLocalStorage();
    };

    // Listen for storage changes
    window.addEventListener('storage', checkLocalStorage);
    
    // Listen for all data change events
    window.addEventListener('transactionAdded', handleDataChange);
    window.addEventListener('transactionDeleted', handleDataChange);
    window.addEventListener('transactionEdited', handleDataChange);
    window.addEventListener('balanceUpdated', handleDataChange);
    window.addEventListener('settingsUpdated', handleDataChange);
    window.addEventListener('dataSynced', () => setHasUnsavedChanges(false));

    checkAuth();
    checkLocalStorage();

    return () => {
      window.removeEventListener('storage', checkLocalStorage);
      window.removeEventListener('transactionAdded', handleDataChange);
      window.removeEventListener('transactionDeleted', handleDataChange);
      window.removeEventListener('transactionEdited', handleDataChange);
      window.removeEventListener('balanceUpdated', handleDataChange);
      window.removeEventListener('settingsUpdated', handleDataChange);
      window.removeEventListener('dataSynced', () => setHasUnsavedChanges(false));
    };
  }, []);

  if (!hasLocalData && !hasUnsavedChanges) return null;

  const showSyncWarning = !isLoggedIn || hasUnsavedChanges;

  return (
    <div
      className={`w-full p-2 text-sm flex items-center justify-center gap-2 ${
        showSyncWarning ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
      }`}
    >
      {showSyncWarning ? (
        <>
          <AlertCircle className="h-4 w-4" />
          Data saved locally only - Sign in to sync
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4" />
          Data synced to cloud
        </>
      )}
    </div>
  );
};

export default SyncStatusBar;