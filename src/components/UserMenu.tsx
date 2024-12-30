import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import OpenAIKeyButton from './OpenAIKeyButton';
import { supabase } from '@/lib/supabaseClient';

const UserMenu = () => {
  const { t } = useLanguage();
  const user = supabase.auth.getUser();
  const userName = user?.data?.user?.user_metadata?.name || '';

  return (
    <div className="flex items-center gap-4">
      {userName && (
        <span className="text-sm font-medium">
          {t('welcome.user', { name: userName })}
        </span>
      )}
      <OpenAIKeyButton />
    </div>
  );
};

export default UserMenu;