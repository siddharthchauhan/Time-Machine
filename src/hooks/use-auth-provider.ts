import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { fetchProfile, tryCreateProfile } from '@/lib/auth-utils';

export const useAuthProvider = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileAttempted, setProfileAttempted] = useState(false);
  const [authFlowState, setAuthFlowState] = useState('signIn');
  const { toast } = useToast();

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (!user?.id) return null;
    
    try {
      console.log("Refreshing profile for user ID:", user.id);
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        console.log("Profile refresh successful:", profileData);
        setProfile(profileData);
        return profileData;
      } else {
        // Try one more time with a direct insert as a final fallback
        if (user.email) {
          const newProfile = await tryCreateProfile(user);
          if (newProfile) {
            setProfile(newProfile);
            return newProfile;
          }
        }
        
        console.log("Profile refresh failed, no data returned");
        return null;
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        // First check for existing session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          if (isMounted) setIsLoading(false);
          return;
        }
        
        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            setProfileAttempted(true);
            const profileData = await fetchProfile(currentSession.user.id);
            
            if (profileData && isMounted) {
              setProfile(profileData);
            } else if (isMounted) {
              // Create a minimal profile if not found
              setProfile({ id: currentSession.user.id, email: currentSession.user.email });
            }
          }
          
          setIsLoading(false);
        }
        
        // Then set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log("Auth state change:", event);
            
            if (!isMounted) return;
            
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            if (newSession?.user) {
              // Mark that we've attempted to fetch the profile
              setProfileAttempted(true);
              
              // Fetch user profile immediately after auth state change
              try {
                const profileData = await fetchProfile(newSession.user.id);
                
                if (profileData && isMounted) {
                  setProfile(profileData);
                } else if (isMounted) {
                  // Create minimal profile if not found
                  setProfile({ id: newSession.user.id, email: newSession.user.email });
                }
              } catch (error) {
                console.error("Error fetching profile in auth state change:", error);
              }
            } else if (isMounted) {
              setProfile(null);
              setProfileAttempted(false);
            }
          }
        );
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        toast({
          title: "Connection Error",
          description: "Failed to initialize authentication. Please refresh the page.",
          variant: "destructive"
        });
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: "Could not connect to authentication service. Please try again.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
      }
      
      return { data, error };
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: "Could not connect to authentication service. Please try again.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "Could not sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    session,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    isLoading,
    refreshProfile,
    authFlowState,
    setAuthFlowState
  };
};
