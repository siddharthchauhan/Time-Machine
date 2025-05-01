
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useTimeEntryForm = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [description, setDescription] = useState('');
  const [manualHours, setManualHours] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { profile, supabase } = useAuth();

  const validateRequiredFields = () => {
    if (!selectedProject || !selectedTask) {
      toast({
        title: "Required fields missing",
        description: "Please select a project and task before starting the timer",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const saveTimeEntry = async (hours: number, status: 'draft' | 'submitted'): Promise<boolean> => {
    if (!selectedProject || !selectedTask || !hours) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);
    
    try {
      const entryDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      // Make sure user_id is available
      if (!profile?.id) {
        throw new Error("User profile not found");
      }
      
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
    validateRequiredFields,
    saveTimeEntry
  };
};
