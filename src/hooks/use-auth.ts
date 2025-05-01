
import { useContext, useEffect, useState } from 'react';
import { AuthContext, UserProfile } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const [isReady, setIsReady] = useState(false);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Add an additional check to ensure profile is available
  useEffect(() => {
    if (context.profile?.id) {
      setIsReady(true);
    } else if (context.user?.id && !context.profile) {
      // If we have a user but no profile, try to fetch it
      const fetchProfile = async () => {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', context.user?.id)
            .single();
            
          // We don't need to do anything here as the AuthProvider should handle updating the profile
          console.log("Profile fetch attempt:", data ? "successful" : "not found");
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      
      fetchProfile();
    }
  }, [context.user, context.profile]);
  
  return {
    ...context,
    supabase,
    isReady
  };
};
