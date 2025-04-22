
import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext, UserProfile } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('AuthProvider: Auth state changed', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          console.log('AuthProvider: User is authenticated, fetching profile');
          // Fetch user profile
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            setIsLoading(false);
            return;
          }
          
          console.log('AuthProvider: Profile data retrieved', profileData);
          setProfile(profileData);
          setIsLoading(false);
        } else {
          console.log('AuthProvider: No user session');
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('AuthProvider: Checking existing session', currentSession ? 'exists' : 'none');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        console.log('AuthProvider: Existing user found, fetching profile');
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data: profileData, error }) => {
            if (error) {
              console.error('Error fetching profile:', error);
              setIsLoading(false);
              return;
            }
            
            console.log('AuthProvider: Profile data retrieved for existing user', profileData);
            setProfile(profileData);
            setIsLoading(false);
          });
      } else {
        console.log('AuthProvider: No existing user, setting loading to false');
        setIsLoading(false);
      }
    });

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  console.log('AuthProvider: Current state', { 
    isLoading, 
    hasUser: !!user, 
    hasProfile: !!profile,
    currentLocation: window.location.pathname
  });

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
