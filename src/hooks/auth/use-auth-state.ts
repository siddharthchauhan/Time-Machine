
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/lib/auth';

/**
 * Custom hook to manage authentication state
 */
export const useAuthState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileAttempted, setProfileAttempted] = useState(false);
  const [authFlowState, setAuthFlowState] = useState('signIn');
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...");
        // First check for existing session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          if (isMounted) setIsLoading(false);
          return;
        }
        
        if (isMounted) {
          if (currentSession?.user) {
            console.log("Session found during initialization:", currentSession.user.id);
          } else {
            console.log("No session found during initialization");
          }
          
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            setProfileAttempted(true);
          }
          
          setIsLoading(false);
        }
        
        // Then set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log("Auth state change:", event, newSession?.user?.id);
            
            if (!isMounted) return;
            
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            if (newSession?.user) {
              // Mark that we've attempted to fetch the profile
              setProfileAttempted(true);
            } else if (isMounted) {
              console.log("Setting profile to null after auth state change");
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

  return {
    isLoading,
    session,
    user,
    profile,
    setProfile,
    profileAttempted,
    setProfileAttempted,
    authFlowState,
    setAuthFlowState
  };
};
