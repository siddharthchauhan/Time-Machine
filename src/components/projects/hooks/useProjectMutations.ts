
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Project, ProjectFormValues } from "../ProjectModel";

export function useProjectMutations(
  projects: Project[], 
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { supabase, profile } = useAuth();
  
  const handleCreateProject = async (values: ProjectFormValues): Promise<boolean> => {
    if (!profile?.id) {
      console.error("No user profile found");
      toast({
        title: "Error",
        description: "User profile not available. Please try again after refresh.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert project into database
      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: values.name,
          description: values.description,
          client_id: values.clientId,
          start_date: values.startDate,
          end_date: values.endDate,
          status: values.status,
          budget_hours: values.budgetHours,
          budget_amount: values.budgetAmount,
          created_by: profile.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setProjects((prev: Project[]) => [...prev, data as Project]);
      
      toast({
        title: "Project created",
        description: `${values.name} has been created successfully`
      });
      
      return true;
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateProject = async (projectId: string, values: ProjectFormValues): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Update project in database
      const { data, error } = await supabase
        .from("projects")
        .update({
          name: values.name,
          description: values.description,
          client_id: values.clientId,
          start_date: values.startDate,
          end_date: values.endDate,
          status: values.status,
          budget_hours: values.budgetHours,
          budget_amount: values.budgetAmount,
          updated_at: new Date().toISOString()
        })
        .eq("id", projectId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setProjects((prev: Project[]) => 
        prev.map(project => project.id === projectId ? (data as Project) : project)
      );
      
      toast({
        title: "Project updated",
        description: `${values.name} has been updated successfully`
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating project:", error);
      toast({
        title: "Error updating project",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleArchiveProject = async (projectId: string): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Update project status to archived in database
      const { data, error } = await supabase
        .from("projects")
        .update({
          status: "archived",
          updated_at: new Date().toISOString()
        })
        .eq("id", projectId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setProjects((prev: Project[]) => 
        prev.map(project => project.id === projectId ? (data as Project) : project)
      );
      
      toast({
        title: "Project archived",
        description: `Project has been archived successfully`
      });
      
      return true;
    } catch (error: any) {
      console.error("Error archiving project:", error);
      toast({
        title: "Error archiving project",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    handleCreateProject,
    handleUpdateProject,
    handleArchiveProject
  };
}
