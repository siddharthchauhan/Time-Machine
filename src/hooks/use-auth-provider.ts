
import { useEffect } from 'react';
import { useAuthState } from './auth/use-auth-state';
import { useProfileManagement } from './auth/use-profile-management';
import { useAuthActions } from './auth/use-auth-actions';
import { fetchProfile, tryCreateProfile } from '@/lib/auth-utils';

/**
 * Main auth provider hook that combines auth state, profile management, and auth actions
 */
export const useAuthProvider = () => {
  const {
    isLoading,
    session,
    user,
    profile,
    setProfile,
    profileAttempted,
    setProfileAttempted,
    authFlowState,
    setAuthFlowState
  } = useAuthState();

  const { profileLoading, refreshProfile } = useProfileManagement(user, setProfile);
  const { signIn, signUp, signOut } = useAuthActions(user);

  // Load profile data when user is set but profile is not yet attempted
  useEffect(() => {
    let isMounted = true;

    const loadUserProfile = async () => {
      if (user && !profile && profileAttempted) {
        try {
          console.log("Loading profile for user:", user.id);
          const profileData = await fetchProfile(user.id);
          
          if (profileData && isMounted) {
            console.log("Profile loaded:", profileData.id);
            setProfile(profileData);
          } else if (isMounted && user.email) {
            // Create a minimal profile if not found
            console.log("Creating minimal profile on load");
            const newProfile = await tryCreateProfile(user);
            if (newProfile) {
              setProfile(newProfile);
            } else {
              console.log("Creating default profile from user data");
              setProfile({ 
                id: user.id, 
                email: user.email,
                full_name: user.user_metadata?.full_name || user.email 
              });
            }
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      }
    };

    loadUserProfile();

    return () => {
      isMounted = false;
    };
  }, [user, profile, profileAttempted]);

  return {
    session,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    isLoading,
    refreshProfile,
    authFlowState,
    setAuthFlowState
  };
};
