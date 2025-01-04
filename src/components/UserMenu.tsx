import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Settings, Key } from 'lucide-react';
import { validateOpenAiKey } from '@/utils/apiKeyValidation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

const UserMenu = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      localStorage.clear();
      toast({
        title: t('success'),
        description: t('logout.success'),
      });
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

  const handleSaveApiKey = async () => {
    if (!validateOpenAiKey(apiKey)) {
      toast({
        title: t('error'),
        description: 'API key must start with sk-',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No active session');
      }

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          openai_api_key: apiKey
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // Dispatch event for sync status when API key is updated
      window.dispatchEvent(new Event('settingsUpdated'));

      setOpenDialog(false);
      setApiKey('');
      toast({
        title: t('success'),
        description: t('data.saved'),
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: t('error'),
        description: t('save.failed'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {userName || t('menu')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('settings')}</span>
          </DropdownMenuItem>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Key className="mr-2 h-4 w-4" />
                <span>Update OpenAI Key</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>OpenAI API Key</DialogTitle>
                <DialogDescription>
                  Enter your OpenAI API key. The key must start with 'sk-'.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type="password"
                />
                <Button 
                  onClick={handleSaveApiKey} 
                  className="w-full"
                  disabled={isLoading || !apiKey.trim()}
                >
                  {isLoading ? 'Saving...' : 'Save and Continue'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;