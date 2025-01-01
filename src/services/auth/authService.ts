import { supabase } from '@/lib/supabaseClient';

export const signUpUser = async (email: string, password: string, name: string) => {
  try {
    console.log('Attempting to sign up user:', { email, name });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error('Signup error:', error);
      throw error;
    }

    console.log('Signup successful:', data);
    return data;
  } catch (error: any) {
    console.error('Signup error:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    console.log('Attempting to sign in user:', { email });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    console.log('Sign in successful:', data);
    return data;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};