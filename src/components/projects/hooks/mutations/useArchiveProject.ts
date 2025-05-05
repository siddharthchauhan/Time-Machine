
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Project } from "../../ProjectModel";

export function useArchiveProject(
  projects: Project[],
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { supabase, profile } = useAuth();
  
  const handleArchiveProject = async (projectId: string): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Handle guest user specially
      if (profile?.id === 'guest') {
        // Get existing projects from localStorage
        const existingProjects = localStorage.getItem('guestProjects') 
          ? JSON.parse(localStorage.getItem('guestProjects')!) 
          : [];
        
        // Find and update the project status to archived
        const updatedProjects = existingProjects.map((project: Project) => {
          if (project.id === projectId) {
            return {
              ...project,
              status: "archived" as "active" | "completed" | "onHold" | "archived",
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
            status: "archived",
            updated_at: new Date().toISOString()
          } : project)
        );
        
        toast({
          title: "Project archived",
          description: `Project has been archived successfully`
        });
        
        return true;
      }
      
      // For real users, update project status to archived in database
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
      
      // Convert to Project type to ensure compatibility
      const archivedProject: Project = {
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
        prev.map(project => project.id === projectId ? archivedProject : project)
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
    handleArchiveProject
  };
}
