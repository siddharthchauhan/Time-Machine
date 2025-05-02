
import { useContext, useEffect, useState } from 'react';
import { AuthContext, UserProfile } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Add an additional check to ensure profile is available
  useEffect(() => {
    let isMounted = true;
    
    const checkProfile = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      if (context.user?.id && !context.profile?.id) {
        // If we have a user but no complete profile, try to fetch it
        try {
          if (context.refreshProfile) {
            console.log("Attempting to refresh profile for user:", context.user.id);
            const profileData = await context.refreshProfile();
            
            if (isMounted) {
              if (profileData?.id) {
                console.log("Profile loaded successfully:", profileData.id);
                setIsReady(true);
                setLoadError(null);
              } else {
                console.error("Profile refresh returned no data");
                setIsReady(false);
                setLoadError("Could not load your profile data");
              }
              setIsLoading(false);
            }
          } else {
            console.error("refreshProfile function is not available in context");
            if (isMounted) {
              setIsLoading(false);
              setIsReady(false);
              setLoadError("Profile refresh function not available");
            }
          }
        } catch (error: any) {
          console.error("Error fetching user profile:", error);
          if (isMounted) {
            setIsLoading(false);
            setIsReady(false);
            setLoadError(error.message || "Error loading profile");
          }
        }
      } else {
        // We already have a profile or no user is logged in
        if (isMounted) {
          setIsReady(!!context.profile?.id);
          setIsLoading(false);
          
          if (context.user?.id && !context.profile?.id) {
            setLoadError("Profile data not available");
          } else {
            setLoadError(null);
          }
        }
      }
    };
    
    checkProfile();
    
    return () => {
      isMounted = false;
    };
  }, [context.user, context.profile, context.refreshProfile]);

  const forceRefreshProfile = async (): Promise<boolean> => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const refreshedProfile = await context.refreshProfile();
      setIsLoading(false);
      if (refreshedProfile?.id) {
        setIsReady(true);
        return true;
      } else {
        setLoadError("Could not refresh profile data");
        return false;
      }
    } catch (error: any) {
      console.error("Error in forceRefreshProfile:", error);
      setLoadError(error.message || "Error refreshing profile");
      setIsLoading(false);
      return false;
    }
  };
  
  return {
    ...context,
    supabase,
    isReady,
    isLoading,
    loadError,
    forceRefreshProfile
  };
};
