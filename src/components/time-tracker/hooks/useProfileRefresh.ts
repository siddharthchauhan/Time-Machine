
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useProfileRefresh = () => {
  const { toast } = useToast();
  const { isReady, profile, loadError, forceRefreshProfile } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Function to refresh profile and retry project loading
  const handleProfileRefresh = useCallback(async (): Promise<void> => {
    console.log("Attempting to refresh profile");
    setIsRefreshing(true);
    
    try {
      const refreshedProfile = await forceRefreshProfile();
      if (refreshedProfile?.id) {
        toast({
          title: "Profile refreshed",
          description: "Your profile has been successfully loaded.",
        });
      } else {
        toast({
          title: "Profile refresh failed",
          description: "Please try signing out and signing back in.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Profile refresh error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [forceRefreshProfile, toast]);
  
  // Run profile refresh when component mounts if no profile is available
  useEffect(() => {
    let mounted = true;
    
    const loadProfile = async () => {
      if (!isReady || !profile?.id) {
        console.log("Profile not ready on mount, trying to refresh");
        setIsRefreshing(true);
        try {
          await forceRefreshProfile();
        } catch (error) {
          console.error("Initial profile refresh failed:", error);
        } finally {
          if (mounted) setIsRefreshing(false);
        }
      }
    };
    
    loadProfile();
    
    return () => {
      mounted = false;
    };
  }, [isReady, profile, forceRefreshProfile]);

  return {
    handleProfileRefresh,
    loadError,
    isReady,
    profile,
    isRefreshing
  };
};
