
import { useContext, useEffect, useState } from 'react';
import { AuthContext, UserProfile } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Add an additional check to ensure profile is available
  useEffect(() => {
    let isMounted = true;
    
    const checkProfile = async () => {
      setIsLoading(true);
      
      if (context.user?.id && !context.profile?.id) {
        // If we have a user but no complete profile, try to fetch it
        try {
          const profileData = await context.refreshProfile();
          
          if (isMounted) {
            setIsReady(!!profileData);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else {
        // We already have a profile or no user is logged in
        if (isMounted) {
          setIsReady(!!context.profile?.id);
          setIsLoading(false);
        }
      }
    };
    
    checkProfile();
    
    return () => {
      isMounted = false;
    };
  }, [context.user, context.profile, context.refreshProfile]);
  
  return {
    ...context,
    supabase,
    isReady,
    isLoading
  };
};
