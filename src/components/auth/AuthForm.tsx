import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthFormProps {
  isSignUp: boolean;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  handleSave: (e: React.FormEvent) => void;
  setIsSignUp: (value: boolean) => void;
  t: (key: string) => string;
  isLoading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isSignUp,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  handleSave,
  setIsSignUp,
  t,
  isLoading = false,
}) => {
  return (
    <form onSubmit={handleSave} className="space-y-4">
      {isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="name">{t('auth.name')}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('auth.name.placeholder')}
            required={isSignUp}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">{t('auth.email')}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.email.placeholder')}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t('auth.password')}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.password.placeholder')}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isSignUp ? t('auth.signup') : t('auth.signin')}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setIsSignUp(!isSignUp)}
        disabled={isLoading}
      >
        {isSignUp ? t('auth.have.account') : t('auth.need.account')}
      </Button>
    </form>
  );
};

export default AuthForm;