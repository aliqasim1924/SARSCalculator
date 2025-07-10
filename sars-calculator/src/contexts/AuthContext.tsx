import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  profileLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: { full_name: string; company_name: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted && !sessionInitialized) {
        console.warn('Session initialization timeout - proceeding without auth');
        setLoading(false);
        setSessionInitialized(true);
      }
    }, 10000); // 10 second timeout

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Initializing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          setSessionInitialized(true);
          return;
        }

        console.log('Session initialized:', session ? 'Found' : 'None');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setSessionInitialized(true);
        
        // Load profile in background (don't block UI)
        if (session?.user) {
          loadProfile(session.user.id).catch(console.error);
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        if (mounted) {
          setLoading(false);
          setSessionInitialized(true);
        }
      } finally {
        clearTimeout(loadingTimeout);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Load profile in background
        loadProfile(session.user.id).catch(console.error);
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
      
      // Always ensure loading is false after auth state changes
      if (sessionInitialized) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      mountedRef.current = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, [sessionInitialized]);

  const loadProfile = async (userId: string, retryCount = 0) => {
    if (!mountedRef.current) return;
    
    setProfileLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!mountedRef.current) return;

      if (error) {
        console.error('Error loading profile:', error);
        
        // Retry up to 3 times for network errors
        if (retryCount < 3 && (error.code === 'PGRST301' || error.message.includes('network'))) {
          console.log(`Retrying profile load (${retryCount + 1}/3)...`);
          setTimeout(() => loadProfile(userId, retryCount + 1), 1000 * (retryCount + 1));
          return;
        }
        
        // For other errors, continue without profile
        console.warn('Profile loading failed, continuing without profile data');
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Profile loading error:', error);
      
      // Retry for network errors
      if (retryCount < 3 && mountedRef.current) {
        console.log(`Retrying profile load (${retryCount + 1}/3)...`);
        setTimeout(() => loadProfile(userId, retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
    } finally {
      if (mountedRef.current) {
        setProfileLoading(false);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: { full_name: string; company_name: string }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            company_name: userData.company_name,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      // Update the profile with additional info after the trigger creates it
      if (data.user) {
        const userId = data.user.id;
        // Wait a moment for the trigger to complete
        setTimeout(async () => {
          await supabase
            .from('profiles')
            .update({
              full_name: userData.full_name,
              company_name: userData.company_name,
            })
            .eq('id', userId);
        }, 1000);
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      // Clear local state
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) {
      return { error: 'No user logged in' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      // Reload profile
      await loadProfile(user.id);
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 