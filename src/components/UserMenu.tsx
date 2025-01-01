import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import OpenAIKeyButton from './OpenAIKeyButton';
import { supabase } from '@/lib/supabaseClient';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserMenu = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata?.name) {
      setUserName(user.user_metadata.name);
      setIsLoggedIn(true);
    } else {
      setUserName('');
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUserName('');
      // Clear local storage
      localStorage.clear();
      toast({
        title: t('success'),
        description: t('logout.success'),
      });
      // Reload the page to clear all data
      window.location.reload();
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: t('error'),
        description: t('logout.failed'),
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.user_metadata?.name) {
        setUserName(session.user.user_metadata.name);
        setIsLoggedIn(true);
      } else {
        setUserName('');
        setIsLoggedIn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {userName && (
        <span className="text-sm font-medium">
          {t('welcome.user', { name: userName })}
        </span>
      )}
      <OpenAIKeyButton />
      <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        {t('logout')}
      </Button>
    </div>
  );
};

export default UserMenu;