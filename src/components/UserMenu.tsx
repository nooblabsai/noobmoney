import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import OpenAIKeyButton from './OpenAIKeyButton';
import { supabase } from '@/services/auth/authService';

const UserMenu = () => {
  const { t } = useLanguage();
  const [userName, setUserName] = React.useState<string>('');

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.name) {
        setUserName(user.user_metadata.name);
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
      <OpenAIKeyButton />
    </div>
  );
};

export default UserMenu;