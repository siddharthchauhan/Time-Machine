
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/lib/auth';
import { useState, useEffect } from 'react';

/**
 * Mock auth hook that provides placeholder values without actual authentication
 */
export const useAuth = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Mock user profile with default values
  const mockProfile: UserProfile = {
    id: 'guest',
    email: 'guest@example.com',
    full_name: 'Guest User',
    role: 'employee'
  };
  
  // Mock user with default values
  const mockUser: User | null = {
    id: 'guest',
    app_metadata: {},
    user_metadata: {
      full_name: 'Guest User'
    },
    aud: 'authenticated',
    created_at: '',
    email: 'guest@example.com',
    email_confirmed_at: '',
  } as User;

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);
  
  // Mock functions that previously relied on auth
  const signIn = async () => ({ data: null, error: null });
  const signUp = async () => ({ data: null, error: null });
  const signOut = async () => {};
  const refreshProfile = async () => mockProfile;
  const forceRefreshProfile = async () => mockProfile;
  
  return {
    user: mockUser,
    profile: mockProfile,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    isReady: isLoaded,
    isLoading: !isLoaded,
    loadError: null,
    supabase,
    session: null,
    authFlowState: 'signIn',
    setAuthFlowState: () => {},
    forceRefreshProfile
  };
};

export default useAuth;
