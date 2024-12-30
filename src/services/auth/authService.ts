import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lwdnnudfamnwhgkliors.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZG5udWRmYW1ud2hna2xpb3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNzgyODgsImV4cCI6MjA1MDk1NDI4OH0.v_3j4EViANIti2x7atSaUrhp5e7BcfLEmCuq8UO9Ep0';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signUpUser = async (email: string, password: string, name: string) => {
  try {
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

    return data;
  } catch (error: any) {
    console.error('Signup error:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      if (error.message === 'Invalid login credentials') {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }
      throw error;
    }

    if (!data.user || !data.session) {
      throw new Error('Authentication failed. Please try again.');
    }

    return data;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};