
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { UseProjectFormProps, UseProjectFormReturn } from "./project-form/types";
import { useFormState } from "./project-form/useFormState";
import { useProfileCheck } from "./project-form/useProfileCheck";
import { useProjectSubmit } from "./project-form/useProjectSubmit";

export const useProjectForm = ({ onProjectCreated, onClose }: UseProjectFormProps): UseProjectFormReturn => {
  const {
    formValues,
    setFormValues,
    isSubmitting,
    setIsSubmitting,
    isRefreshing,
    setIsRefreshing,
    profileError,
    setProfileError,
    handleChange,
    handleSelectChange
  } = useFormState();

  const { profile, isReady, forceRefreshProfile } = useAuth();

  // Use the profile check hook
  const { handleProfileRefresh } = useProfileCheck(
    setProfileError,
    setIsRefreshing,
    forceRefreshProfile
  );

  // Use the project submit hook
  const { handleSubmit } = useProjectSubmit(
    formValues,
    setFormValues,
    setIsSubmitting,
    onProjectCreated,
    onClose
  );

  // Check profile status
  useEffect(() => {
    if (!profile?.id) {
      setIsRefreshing(true);
      forceRefreshProfile().then(refreshedProfile => {
        setIsRefreshing(false);
        if (!refreshedProfile) {
          setProfileError("Unable to load profile. Please refresh and try again.");
        } else {
          setProfileError(null);
        }
      }).catch(error => {
        setIsRefreshing(false);
        setProfileError("Error refreshing profile: " + (error.message || "Unknown error"));
      });
    } else {
      setProfileError(null);
    }
  }, [profile, forceRefreshProfile]);

  return {
    formValues,
    isSubmitting,
    isRefreshing,
    profileError,
    handleChange,
    handleSelectChange,
    handleSubmit,
    handleRefresh: handleProfileRefresh
  };
};
