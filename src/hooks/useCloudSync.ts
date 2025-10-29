import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { saveTransactions, loadTransactions } from '@/services/transactions/transactionService';
import { Transaction, RecurringTransaction } from '@/types/transactions';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useCloudSync = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
      
      // Load data when user logs in
      if (event === 'SIGNED_IN' && session?.user?.id) {
        loadDataFromCloud(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadDataFromCloud = async (userIdToLoad: string) => {
    try {
      setIsSyncing(true);
      const data = await loadTransactions(userIdToLoad);
      
      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('cloudDataLoaded', { detail: data }));
      
      toast({
        title: t('data.synced'),
        description: t('data.loaded.from.cloud'),
      });
    } catch (error) {
      console.error('Error loading from cloud:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncToCloud = async (
    transactions: Transaction[],
    recurringTransactions: RecurringTransaction[],
    bankBalance: string,
    debtBalance: string
  ) => {
    if (!isLoggedIn || !userId) return;

    // Clear any pending sync
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Debounce sync by 2 seconds
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSyncing(true);
        await saveTransactions(userId, transactions, recurringTransactions, bankBalance, debtBalance);
        
        // Dispatch event to update sync status
        window.dispatchEvent(new CustomEvent('dataSynced'));
      } catch (error) {
        console.error('Error syncing to cloud:', error);
        toast({
          title: t('sync.failed'),
          description: t('sync.failed.description'),
          variant: 'destructive',
        });
      } finally {
        setIsSyncing(false);
      }
    }, 2000);
  };

  return {
    isLoggedIn,
    isSyncing,
    userId,
    syncToCloud,
    loadDataFromCloud,
  };
};
