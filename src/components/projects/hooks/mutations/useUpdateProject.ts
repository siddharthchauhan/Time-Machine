import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Project, ProjectFormValues } from "../../ProjectModel";

export function useUpdateProject(
  projects: Project[],
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { supabase, profile } = useAuth();
  
  const handleUpdateProject = async (projectId: string, values: ProjectFormValues): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Handle guest user specially
      if (profile?.id === 'guest') {
        // Get existing projects from localStorage
        const existingProjects = localStorage.getItem('guestProjects') 
          ? JSON.parse(localStorage.getItem('guestProjects')!) 
          : [];
        
        // Find and update the project
        const updatedProjects = existingProjects.map((project: Project) => {
          if (project.id === projectId) {
            return {
              ...project,
              name: values.name,
              description: values.description || null,
              client_id: values.clientId || null,
              client_name: project.client_name || null, // Preserve existing client_name
              start_date: values.startDate || null,
              end_date: values.endDate || null,
              status: values.status || 'active',
              budget_hours: values.budgetHours || null,
              budget_amount: values.budgetAmount || null,
              updated_at: new Date().toISOString()
            };
          }
          return project;
        });
        
        // Save back to localStorage
        localStorage.setItem('guestProjects', JSON.stringify(updatedProjects));
        
        // Update local state
        setProjects((prev: Project[]) => 
          prev.map(project => project.id === projectId ? {
            ...project,
            name: values.name,
            description: values.description || null,
            client_id: values.clientId || null,
            // client_name remains unchanged
            start_date: values.startDate || null,
            end_date: values.endDate || null,
            status: values.status || 'active',
            budget_hours: values.budgetHours || null,
            budget_amount: values.budgetAmount || null,
            updated_at: new Date().toISOString()
          } : project)
        );
        
        toast({
          title: "Project updated",
          description: `${values.name} has been updated successfully`
        });
        
        return true;
      }
      
      // For real users, update the project in the database
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
      
      // Convert to Project type to ensure compatibility
      const updatedProject: Project = {
        id: data.id,
        name: data.name,
        description: data.description,
        client_id: data.client_id,
        client_name: data.client_name || null,
        start_date: data.start_date,
        end_date: data.end_date,
        budget_hours: data.budget_hours,
        budget_amount: data.budget_amount,
        status: data.status as "active" | "completed" | "onHold" | "archived",
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      // Update local state
      setProjects((prev: Project[]) => 
        prev.map(project => project.id === projectId ? updatedProject : project)
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

  return {
    isSubmitting,
    handleUpdateProject
  };
}
