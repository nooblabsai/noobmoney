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
}) => {
  return (
    <form onSubmit={handleSave} className="space-y-4">
      {isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="name">{t('name')}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('enter.name')}
            required={isSignUp}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('enter.email')}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t('password')}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('enter.password')}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        {isSignUp ? t('sign.up.save') : t('sign.in.save')}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? t('have.account') : t('need.account')}
      </Button>
    </form>
  );
};

export default AuthForm;