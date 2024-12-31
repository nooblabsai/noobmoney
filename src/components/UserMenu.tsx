import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import OpenAIKeyButton from './OpenAIKeyButton';
import { supabase } from '@/lib/supabaseClient';

const UserMenu = () => {
  const { t } = useLanguage();
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

  useEffect(() => {
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

  return (
    <div className="flex items-center gap-4">
      {userName && (
        <span className="text-sm font-medium">
          {t('welcome.user', { name: userName })}
        </span>
      )}
      {isLoggedIn && <OpenAIKeyButton />}
    </div>
  );
};

export default UserMenu;