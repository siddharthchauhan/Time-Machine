
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, UserProfile } from '@/lib/auth';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any | null, data: any | null }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  refreshProfile: () => Promise<UserProfile | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileAttempted, setProfileAttempted] = useState(false);

  // Function to fetch user profile
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      console.log("Profile fetched:", data ? "success" : "not found");
      return data;
    } catch (error) {
      console.error("Exception fetching profile:", error);
      return null;
    }
  };

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (!user?.id) return null;
    
    try {
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
        return profileData;
      }
      return null;
    } catch (error) {
      console.error("Error refreshing profile:", error);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state change:", event);
        
        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        
          if (currentSession?.user) {
            // Mark that we've attempted to fetch the profile
            setProfileAttempted(true);
            
            // Fetch user profile immediately after auth state change
            try {
              const profileData = await fetchProfile(currentSession.user.id);
              
              if (profileData && isMounted) {
                setProfile(profileData);
              } else if (isMounted) {
                setProfile({ id: currentSession.user.id, full_name: currentSession.user.email });
              }
            } catch (error) {
              console.error("Error fetching profile in auth state change:", error);
            }
          } else if (isMounted) {
            setProfile(null);
            setProfileAttempted(false);
          }
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
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
              setProfile({ id: currentSession.user.id, full_name: currentSession.user.email });
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    isLoading,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
