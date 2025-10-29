import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Cloud } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SyncStatusBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);
  const { t } = useLanguage();

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

    // Listen for storage changes
    window.addEventListener('storage', checkLocalStorage);
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    checkAuth();
    checkLocalStorage();

    return () => {
      window.removeEventListener('storage', checkLocalStorage);
      subscription.unsubscribe();
    };
  }, []);

  if (!hasLocalData) return null;

  const showSyncWarning = !isLoggedIn;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 w-full p-2 text-sm flex items-center justify-center gap-2 ${
        showSyncWarning ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
      }`}
    >
      {showSyncWarning ? (
        <>
          <AlertCircle className="h-4 w-4" />
          {t('data.saved.locally')} - {t('login.to.sync')}
        </>
      ) : (
        <>
          <Cloud className="h-4 w-4" />
          {t('data.synced')}
        </>
      )}
    </div>
  );
};

export default SyncStatusBar;