import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { storage } from './storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase config:', { 
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING'
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: storage,
    storageKey: 'sars-calculator-auth',
    flowType: 'pkce',
    debug: import.meta.env.DEV,
  },
  global: {
    headers: {
      'X-Client-Info': 'sars-calculator@1.0.0',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Add connection health check
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    console.log('User signed out, clearing local storage');
    storage.removeItem('sars-calculator-auth');
  } else if (event === 'SIGNED_IN') {
    console.log('User signed in, session stored');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
});

// Test connection on initialization
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connection established');
  }
});

// Database helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']; 