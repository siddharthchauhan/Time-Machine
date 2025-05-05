
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/lib/auth';
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authFlowState, setAuthFlowState] = useState('signIn');
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If user signed out, clear profile
        if (!currentSession?.user) {
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
      
      if (currentSession?.user) {
        // Try to load the profile
        refreshProfile()
          .then(() => {
            if (isMounted) {
              setIsReady(true);
              setLoadError(null);
            }
          })
          .catch(error => {
            if (isMounted) {
              console.error('Error loading profile on init:', error);
              setLoadError(error);
              setIsReady(true);
            }
          });
      } else {
        if (isMounted) {
          setIsReady(true);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        setProfile(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setLoadError(error);
      return null;
    }
  };

  // Alias for refreshProfile to maintain compatibility with existing code
  const forceRefreshProfile = refreshProfile;

  return {
    session,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    isLoading,
    refreshProfile,
    forceRefreshProfile,
    authFlowState,
    setAuthFlowState,
    isReady,
    loadError,
    supabase
  };
};

export default useAuth;
