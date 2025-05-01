
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
      
      if (context.user?.id && !context.profile) {
        // If we have a user but no profile, try to fetch it
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', context.user?.id)
            .single();
            
          if (error) throw error;
          
          console.log("Profile fetch attempt:", data ? "successful" : "not found");
          
          // Wait for AuthProvider to update with profile data
          if (data) {
            // Give time for the AuthProvider to update the profile
            setTimeout(() => {
              if (isMounted) {
                setIsReady(!!context.profile?.id);
                setIsLoading(false);
              }
            }, 500);
          } else {
            if (isMounted) {
              setIsLoading(false);
            }
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
  }, [context.user, context.profile]);
  
  return {
    ...context,
    supabase,
    isReady,
    isLoading
  };
};
