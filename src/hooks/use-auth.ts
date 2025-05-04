
import { useContext, useEffect, useState } from 'react';
import { AuthContext, UserProfile } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
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
      } else if (context.user?.id && context.profile?.id) {
        // We already have a profile
        if (isMounted) {
          console.log("Profile already loaded:", context.profile.id);
          setIsReady(true);
          setIsLoading(false);
          setLoadError(null);
        }
      } else {
        // No user is logged in
        if (isMounted) {
          console.log("No user logged in");
          setIsReady(false);
          setIsLoading(false);
          setLoadError(null);
        }
      }
    };
    
    checkProfile();
    
    return () => {
      isMounted = false;
    };
  }, [context.user, context.profile, context.refreshProfile, retryCount]);

  const forceRefreshProfile = async (): Promise<UserProfile | null> => {
    console.log("Force refreshing profile");
    setIsLoading(true);
    setLoadError(null);
    try {
      // Direct database query as a fallback if the context's refreshProfile fails
      if (context.user?.id) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', context.user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (profileData) {
          // Also update the context
          if (context.refreshProfile) {
            await context.refreshProfile();
          }
          
          setIsLoading(false);
          setIsReady(true);
          console.log("Profile refreshed successfully via direct query:", profileData.id);
          return profileData as UserProfile;
        }
      }
      
      // If direct query didn't work, try the context method
      if (context.refreshProfile) {
        const refreshedProfile = await context.refreshProfile();
        setIsLoading(false);
        
        if (refreshedProfile?.id) {
          setIsReady(true);
          console.log("Profile refreshed successfully via context:", refreshedProfile.id);
          return refreshedProfile;
        } else {
          setLoadError("Could not refresh profile data");
          console.error("Profile refresh returned no data");
          setRetryCount(prev => prev + 1); // Increment retry counter to trigger the useEffect
          return null;
        }
      } else {
        setIsLoading(false);
        setLoadError("Profile refresh function not available");
        return null;
      }
    } catch (error: any) {
      console.error("Error in forceRefreshProfile:", error);
      setLoadError(error.message || "Error refreshing profile");
      setIsLoading(false);
      setRetryCount(prev => prev + 1); // Increment retry counter to trigger the useEffect
      return null;
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
