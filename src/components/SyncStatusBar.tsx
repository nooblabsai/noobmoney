import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AlertCircle, CloudCheck } from 'lucide-react';

const SyncStatusBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);

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

    checkAuth();
    checkLocalStorage();

    // Listen for storage changes
    window.addEventListener('storage', checkLocalStorage);
    return () => window.removeEventListener('storage', checkLocalStorage);
  }, []);

  if (!hasLocalData) return null;

  return (
    <div
      className={`w-full p-2 text-sm flex items-center justify-center gap-2 ${
        isLoggedIn ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
      }`}
    >
      {isLoggedIn ? (
        <>
          <CloudCheck className="h-4 w-4" />
          Data synced to cloud
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4" />
          Data saved locally only - Sign in to sync
        </>
      )}
    </div>
  );
};

export default SyncStatusBar;