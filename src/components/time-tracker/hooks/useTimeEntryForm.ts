
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useTimeEntryForm = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [description, setDescription] = useState('');
  const [manualHours, setManualHours] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const { toast } = useToast();
  const { profile, supabase, isReady, refreshProfile } = useAuth();
  
  // Check if profile is loaded
  useEffect(() => {
    let isMounted = true;
    
    const checkProfileStatus = async () => {
      if (isReady && profile?.id) {
        if (isMounted) {
          setIsProfileLoaded(true);
          console.log("Profile loaded successfully:", profile.id);
        }
      } else if (isReady && !profile?.id) {
        // Try to refresh the profile if user is authenticated but profile is missing
        try {
          const refreshedProfile = await refreshProfile();
          if (isMounted) {
            setIsProfileLoaded(!!refreshedProfile?.id);
            console.log("Profile refresh result:", refreshedProfile ? "success" : "failed");
          }
        } catch (error) {
          console.error("Error refreshing profile:", error);
          if (isMounted) {
            setIsProfileLoaded(false);
          }
        }
      }
    };
    
    checkProfileStatus();
    
    return () => {
      isMounted = false;
    };
  }, [isReady, profile, refreshProfile]);

  const validateRequiredFields = useCallback(() => {
    if (!selectedProject || !selectedTask) {
      toast({
        title: "Required fields missing",
        description: "Please select a project and task before starting the timer",
        variant: "destructive",
      });
      return false;
    }
    
    if (!isProfileLoaded) {
      toast({
        title: "Profile not loaded",
        description: "Your user profile is not available. Please refresh the page.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  }, [selectedProject, selectedTask, toast, isProfileLoaded]);

  const saveTimeEntry = async (hours: number, status: 'draft' | 'submitted'): Promise<boolean> => {
    if (!selectedProject || !selectedTask || !hours) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    // Make sure user_id is available
    if (!profile?.id) {
      toast({
        title: "Error saving time entry",
        description: "User profile not available. Please try again after refreshing the page.",
        variant: "destructive",
      });
      console.error("User profile not available for time entry creation");
      return false;
    }

    setIsSubmitting(true);
    
    try {
      const entryDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      // Create a new time entry in the database
      const { error } = await supabase
        .from('time_entries')
        .insert({
          project_id: selectedProject,
          task_id: selectedTask,
          date: entryDate,
          hours: hours,
          description: description,
          user_id: profile.id,
          status: status,
          approval_status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: status === 'draft' ? "Time entry saved" : "Time entry submitted",
        description: status === 'draft' 
          ? "Your time entry has been saved as a draft"
          : "Your time entry has been submitted for approval",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error saving time entry:", error);
      toast({
        title: `Error ${status === 'draft' ? 'saving' : 'submitting'} time entry`,
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    date,
    setDate,
    selectedProject,
    setSelectedProject,
    selectedTask,
    setSelectedTask,
    description,
    setDescription,
    manualHours,
    setManualHours,
    isSubmitting,
    isProfileLoaded,
    validateRequiredFields,
    saveTimeEntry
  };
};
