import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lwdnnudfamnwhgkliors.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZG5udWRmYW1ud2hna2xpb3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNzgyODgsImV4cCI6MjA1MDk1NDI4OH0.v_3j4EViANIti2x7atSaUrhp5e7BcfLEmCuq8UO9Ep0';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'app-storage-key',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Handle auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth state changed:', event, 'Session:', session);
  
  if (event === 'SIGNED_OUT') {
    console.log('User signed out, clearing storage');
    localStorage.clear();
    window.location.reload();
  } else if (event === 'TOKEN_REFRESHED') {
    if (!session) {
      console.log('Token refresh failed, clearing storage');
      localStorage.clear();
      window.location.reload();
    } else {
      console.log('Token refreshed successfully');
    }
  }
});

// Export a function to check and refresh session if needed
export const checkSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session check error:', error);
      throw error;
    }
    
    if (!session) {
      console.log('No valid session found');
      return null;
    }

    // Verify the session is not expired
    const tokenExpiryTime = session.expires_at ? session.expires_at * 1000 : 0;
    if (tokenExpiryTime && tokenExpiryTime < Date.now()) {
      console.log('Session expired, attempting refresh');
      const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshedSession.session) {
        console.error('Session refresh failed:', refreshError);
        return null;
      }
      
      return refreshedSession.session;
    }

    return session;
  } catch (error) {
    console.error('Error checking session:', error);
    return null;
  }
};

// Add a helper to refresh session
export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing session:', error);
      throw error;
    }
    return session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
};