import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import OpenAIKeyButton from './OpenAIKeyButton';
import { supabase } from '@/lib/supabaseClient';

const UserMenu = () => {
  const { t } = useLanguage();
  const [userName, setUserName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.name) {
        setUserName(user.user_metadata.name);
        setIsLoggedIn(true);
      }
    };
    
    getUser();
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