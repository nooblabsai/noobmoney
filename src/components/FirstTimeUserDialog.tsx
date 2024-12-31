import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signUpUser, signInUser } from '@/services/supabaseService';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

interface FirstTimeUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const FirstTimeUserDialog: React.FC<FirstTimeUserDialogProps> = ({ isOpen, onComplete }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        if (!email || !password) {
          toast({
            title: "Error",
            description: "Please fill in all required fields",
            variant: 'destructive',
          });
          return;
        }

        const data = await signInUser(email, password);
        if (!data.user) {
          throw new Error('Invalid credentials');
        }
      } else {
        if (!name || !email || !password) {
          toast({
            title: "Error",
            description: "Please fill in all required fields",
            variant: 'destructive',
          });
          return;
        }

        const data = await signUpUser(email, password, name);
        if (!data.user) {
          throw new Error('Failed to create account');
        }

        // Only save OpenAI key if provided
        if (openaiKey.trim()) {
          const { error: settingsError } = await supabase
            .from('user_settings')
            .upsert({
              user_id: data.user.id,
              openai_api_key: openaiKey
            }, {
              onConflict: 'user_id'
            });

          if (settingsError) {
            console.error('Failed to save OpenAI key:', settingsError);
          }
        }
      }

      toast({
        title: "Success",
        description: isLogin ? "Successfully logged in!" : "Account created successfully!",
      });
      
      onComplete();
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || (isLogin ? "Login failed" : "Account creation failed"),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLogin ? "Welcome Back" : "Welcome"}</DialogTitle>
          <DialogDescription>
            {isLogin ? "Sign in to your account" : "Create an account to get started"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                disabled={isLoading}
                required={!isLogin}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key (Optional)</Label>
              <Input
                id="openai-key"
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
                disabled={isLoading}
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign In" : "Create Account")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
            disabled={isLoading}
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeUserDialog;