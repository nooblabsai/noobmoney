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
      'X-Client-Info': 'supabase-js-web',
      'Access-Control-Allow-Origin': '*'
    }
  }
});

// Handle auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, 'Session:', session);
  
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    // Clear all local storage and reload
    localStorage.clear();
    window.location.reload();
  } else if (event === 'TOKEN_REFRESHED' && !session) {
    // Session refresh failed, clear storage and reload
    localStorage.clear();
    window.location.reload();
  }
});

// Export a function to check session validity
export const checkSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session check error:', error);
      throw error;
    }
    
    if (!session) {
      console.log('No valid session found');
      localStorage.clear();
      return null;
    }

    // Verify the session is not expired
    const tokenExpiryTime = session.expires_at ? session.expires_at * 1000 : 0;
    if (tokenExpiryTime && tokenExpiryTime < Date.now()) {
      console.log('Session expired');
      localStorage.clear();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error checking session:', error);
    localStorage.clear();
    return null;
  }
};

// Add a helper to refresh session
export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    localStorage.clear();
    return null;
  }
};