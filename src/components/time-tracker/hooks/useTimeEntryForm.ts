
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
  const { profile, supabase, isReady, forceRefreshProfile } = useAuth();
  
  // Check if profile is loaded
  useEffect(() => {
    if (isReady && profile?.id) {
      setIsProfileLoaded(true);
      console.log("Profile loaded successfully:", profile.id);
    } else {
      setIsProfileLoaded(false);
      console.log("Profile not loaded:", isReady ? "ready but no profile" : "not ready");
    }
  }, [isReady, profile]);

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
    console.log("Starting saveTimeEntry with:", { hours, status });
    
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
      console.log("Saving time entry with data:", {
        project_id: selectedProject,
        task_id: selectedTask,
        date: entryDate,
        hours: hours,
        description: description,
        user_id: profile.id,
        status: status
      });
      
      // For guest user, store in localStorage
      if (profile.id === 'guest') {
        // Get existing time entries from localStorage or initialize empty array
        const existingEntries = localStorage.getItem('guestTimeEntries') 
          ? JSON.parse(localStorage.getItem('guestTimeEntries')!) 
          : [];
        
        // Create new time entry
        const newEntry = {
          id: crypto.randomUUID(),
          project_id: selectedProject,
          task_id: selectedTask,
          date: entryDate,
          hours: hours,
          description: description,
          user_id: profile.id,
          status: status,
          approval_status: 'pending',
          created_at: new Date().toISOString()
        };
        
        // Add new entry to localStorage
        localStorage.setItem('guestTimeEntries', JSON.stringify([...existingEntries, newEntry]));
        
        // Simulate successful save with a slight delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        toast({
          title: status === 'draft' ? "Time entry saved" : "Time entry submitted",
          description: status === 'draft' 
            ? "Your time entry has been saved as a draft"
            : "Your time entry has been submitted for approval",
        });
        
        console.log("Guest time entry saved to localStorage");
        return true;
      }
      
      // For real users, create a new time entry in the database
      const { error, data } = await supabase
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
        })
        .select();
        
      if (error) {
        console.error("Supabase error saving time entry:", error);
        throw error;
      }
      
      console.log("Time entry saved to database:", data);
      
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
    saveTimeEntry,
    refreshProfile: forceRefreshProfile
  };
};
