
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Project, ProjectFormValues } from "../ProjectModel";
import { useAuth } from "@/hooks/use-auth";

export function useProjectMutations(
  projects: Project[],
  setProjects: (projects: Project[]) => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbConnectionError, setDbConnectionError] = useState<string | null>(null);
  const { toast } = useToast();
  const { supabase, profile } = useAuth();

  const handleCreateProject = async (values: ProjectFormValues): Promise<boolean> => {
    setDbConnectionError(null);
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: values.name,
          description: values.description,
          client_id: values.clientId,
          start_date: values.startDate,
          end_date: values.endDate,
          budget_hours: values.budgetHours,
          budget_amount: values.budgetAmount,
          status: values.status,
          created_by: profile?.id,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        setDbConnectionError(error.message);
        throw error;
      }

      // Create a formatted project object with proper type casting
      const newProject: Project = {
        id: data.id,
        name: data.name,
        description: data.description,
        client_id: data.client_id,
        client_name: undefined, // Will be fetched in the next projects list update
        start_date: data.start_date,
        end_date: data.end_date,
        budget_hours: data.budget_hours,
        budget_amount: data.budget_amount,
        status: data.status as "active" | "completed" | "onHold" | "archived",
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setProjects((prev) => [newProject, ...prev]);
      
      toast({
        title: "Project created",
        description: `${values.name} has been created successfully`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: error.message || "Could not create project",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProject = async (projectId: string, values: ProjectFormValues): Promise<boolean> => {
    setDbConnectionError(null);
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from("projects")
        .update({
          name: values.name,
          description: values.description,
          client_id: values.clientId,
          start_date: values.startDate,
          end_date: values.endDate,
          budget_hours: values.budgetHours,
          budget_amount: values.budgetAmount,
          status: values.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .select()
        .single();

      if (error) {
        setDbConnectionError(error.message);
        throw error;
      }

      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? {
                ...project,
                name: data.name,
                description: data.description,
                client_id: data.client_id,
                start_date: data.start_date,
                end_date: data.end_date,
                budget_hours: data.budget_hours,
                budget_amount: data.budget_amount,
                status: data.status as "active" | "completed" | "onHold" | "archived",
                updated_at: data.updated_at,
              }
            : project
        )
      );

      toast({
        title: "Project updated",
        description: `${values.name} has been updated successfully`,
      });
      return true;
    } catch (error: any) {
      console.error("Error updating project:", error);
      toast({
        title: "Error updating project",
        description: error.message || "Could not update project",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveProject = async (projectId: string): Promise<boolean> => {
    if (!confirm("Are you sure you want to archive this project?")) {
      return false;
    }

    setDbConnectionError(null);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: "archived", updated_at: new Date().toISOString() })
        .eq("id", projectId);

      if (error) {
        setDbConnectionError(error.message);
        throw error;
      }

      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? { ...project, status: "archived" as const }
            : project
        )
      );

      toast({
        title: "Project archived",
        description: "The project has been archived successfully",
      });
      return true;
    } catch (error: any) {
      console.error("Error archiving project:", error);
      toast({
        title: "Error archiving project",
        description: error.message || "Could not archive project",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    isSubmitting,
    dbConnectionError,
    handleCreateProject,
    handleUpdateProject,
    handleArchiveProject,
  };
}
