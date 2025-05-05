
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export const useProfileCheck = (
  setProfileError: (error: string | null) => void,
  setIsRefreshing: (isRefreshing: boolean) => void,
  forceRefreshProfile: () => Promise<any>
) => {
  const handleProfileRefresh = async () => {
    setIsRefreshing(true);
    try {
      const success = await forceRefreshProfile();
      if (!success) {
        setProfileError("Unable to load profile. Please try signing out and back in.");
      } else {
        setProfileError(null);
      }
    } catch (error: any) {
      setProfileError("Error refreshing profile: " + (error.message || "Unknown error"));
    } finally {
      setIsRefreshing(false);
    }
  };

  return { handleProfileRefresh };
};
