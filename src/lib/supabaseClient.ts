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

// Add session recovery logic
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    localStorage.clear();
    window.location.reload();
  } else if (event === 'TOKEN_REFRESHED' && !session) {
    localStorage.clear();
    window.location.reload();
  }
});

// Export a function to check session validity
export const checkSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      throw new Error('Invalid session');
    }
    return session;
  } catch (error) {
    localStorage.clear();
    return null;
  }
};