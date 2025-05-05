
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
    let profileLoaded = false;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;
        
        console.log("Auth state changed:", event, currentSession?.user?.id);

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If user signed out, clear profile
        if (!currentSession?.user) {
          setProfile(null);
          setIsReady(true);
          return;
        }
        
        // When user signs in, immediately try to load profile
        if (event === 'SIGNED_IN' && currentSession?.user && !profileLoaded) {
          try {
            profileLoaded = true;
            const userProfile = await refreshProfile();
            if (isMounted) {
              setIsReady(true);
              setLoadError(null);
            }
          } catch (error) {
            console.error("Error loading profile on auth state change:", error);
            if (isMounted) {
              setLoadError(error);
              setIsReady(true);
            }
          }
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!isMounted) return;
      
      console.log("Initial session check:", currentSession?.user?.id || "No session");
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
      
      if (currentSession?.user && !profileLoaded) {
        // Try to load the profile
        try {
          profileLoaded = true;
          const userProfile = await refreshProfile();
          if (isMounted) {
            setIsReady(true);
            setLoadError(null);
          }
        } catch (error) {
          console.error('Error loading profile on init:', error);
          if (isMounted) {
            setLoadError(error);
            setIsReady(true);
          }
        }
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
      console.log("Signing out user");
      await supabase.auth.signOut();
      console.log("Sign out complete");
      // The auth state listener will handle updating the state
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (!user) {
      console.log("Cannot refresh profile - no user");
      return null;
    }
    
    try {
      console.log("Refreshing profile for user:", user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        console.log("Profile loaded:", data.id);
        setProfile(data);
        return data;
      }
      
      console.log("Profile not found in database, creating guest profile");
      // If no profile found, create a minimal guest profile
      const guestProfile: UserProfile = {
        id: user.id,
        email: user.email || undefined,
        full_name: user.user_metadata?.full_name || user.email || 'User'
      };
      
      setProfile(guestProfile);
      return guestProfile;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setLoadError(error);
      
      // Create a basic profile to prevent further errors
      const fallbackProfile: UserProfile = {
        id: user.id,
        email: user.email || undefined,
        full_name: user.user_metadata?.full_name || user.email || 'User'
      };
      
      setProfile(fallbackProfile);
      return fallbackProfile;
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
