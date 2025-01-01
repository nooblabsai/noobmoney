import { supabase, checkSession } from '../../lib/supabaseClient';

export const signUpUser = async (email: string, password: string, name: string) => {
  try {
    // Clear any existing session before signing up
    await supabase.auth.signOut();
    
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
    // Ensure clean state before sign in
    await supabase.auth.signOut();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === 'Invalid login credentials') {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }
      throw error;
    }

    if (!data.user || !data.session) {
      throw new Error('Authentication failed. Please try again.');
    }

    // Verify session is valid after sign in
    await checkSession();

    return data;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};