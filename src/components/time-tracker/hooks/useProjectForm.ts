
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ProjectFormValues } from "@/components/projects/ProjectModel";

type UseProjectFormProps = {
  onProjectCreated: (project: { id: string; name: string }) => void;
  onClose: () => void;
};

export const useProjectForm = ({ onProjectCreated, onClose }: UseProjectFormProps) => {
  const [formValues, setFormValues] = useState<ProjectFormValues>({
    name: "",
    description: "",
    status: "active"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const { toast } = useToast();
  const { supabase, profile, isReady, loadError, forceRefreshProfile } = useAuth();

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const success = await forceRefreshProfile();
      if (success) {
        setProfileError(null);
        toast({
          title: "Profile refreshed",
          description: "Your profile has been successfully loaded.",
        });
      } else {
        toast({
          title: "Profile refresh failed",
          description: "Could not load your profile data. Please try signing out and back in.",
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    if (!profile?.id) {
      toast({
        title: "Error creating project",
        description: "User profile not available. Please try refreshing your profile.",
        variant: "destructive",
      });
      console.error("User profile not available for project creation");
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Creating project with user ID:", profile.id);
      
      // Handle the mock guest user specially to avoid UUID errors
      if (profile.id === 'guest') {
        // For the guest user, we'll create a mock project with a generated ID
        const mockProjectId = crypto.randomUUID();
        
        // Notify the parent component about the new project
        onProjectCreated({
          id: mockProjectId,
          name: formValues.name,
        });
        
        toast({
          title: "Project created",
          description: `${formValues.name} has been created successfully`,
        });
        
        // Reset form
        setFormValues({
          name: "",
          description: "",
          status: "active"
        });
        onClose();
        return;
      }
      
      // For real users, insert the project into the database
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: formValues.name,
          description: formValues.description || null,
          status: 'active',
          created_by: profile.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Notify the parent component about the new project
      onProjectCreated({
        id: data.id,
        name: data.name,
      });
      
      toast({
        title: "Project created",
        description: `${formValues.name} has been created successfully`,
      });
      
      // Reset form
      setFormValues({
        name: "",
        description: "",
        status: "active"
      });
      onClose();
    } catch (error: any) {
      console.error("Project creation error:", error);
      toast({
        title: "Error creating project",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formValues,
    isSubmitting,
    isRefreshing,
    profileError,
    handleChange,
    handleSubmit,
    handleRefresh
  };
};
