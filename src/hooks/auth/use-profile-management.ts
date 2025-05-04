
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/lib/auth';
import { fetchProfile, tryCreateProfile } from '@/lib/auth-utils';

/**
 * Custom hook to manage user profile operations
 */
export const useProfileManagement = (
  user: User | null,
  setProfile: (profile: UserProfile | null) => void
) => {
  const [profileLoading, setProfileLoading] = useState(false);
  
  /**
   * Refreshes the user profile data
   */
  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (!user?.id) return null;
    
    setProfileLoading(true);
    try {
      console.log("Refreshing profile for user ID:", user.id);
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        console.log("Profile refresh successful:", profileData);
        setProfile(profileData);
        setProfileLoading(false);
        return profileData;
      } else {
        // Try one more time with a direct insert as a final fallback
        if (user.email) {
          const newProfile = await tryCreateProfile(user);
          if (newProfile) {
            setProfile(newProfile);
            setProfileLoading(false);
            return newProfile;
          }
        }
        
        console.log("Profile refresh failed, no data returned");
        setProfileLoading(false);
        return null;
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
      setProfileLoading(false);
      return null;
    }
  };

  return {
    profileLoading,
    refreshProfile
  };
};
