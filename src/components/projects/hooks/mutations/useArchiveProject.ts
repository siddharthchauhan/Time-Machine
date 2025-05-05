
import { useState } from "react";
import { Project } from "../../ProjectModel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useArchiveProject(
  projects: Project[], 
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) {
  const { toast } = useToast();
  
  const handleArchiveProject = async (projectId: string): Promise<boolean> => {
    console.log("Archiving project:", projectId);
    
    try {
      // Check if we're using a guest user
      const { data: { user } } = await supabase.auth.getUser();
      const isGuestUser = !user || user.id === 'guest';
      
      if (isGuestUser) {
        // For guest users, handle archiving in localStorage
        console.log("Guest user - archiving project in localStorage");
        
        // Get existing projects from localStorage
        const existingProjects = localStorage.getItem('guestProjects');
        
        if (existingProjects) {
          const parsedProjects = JSON.parse(existingProjects);
          
          // Find the project to archive and update its status
          const updatedProjects = parsedProjects.map((project: any) => {
            if (project.id === projectId) {
              return { ...project, status: 'archived' };
            }
            return project;
          });
          
          // Save updated projects to localStorage
          localStorage.setItem('guestProjects', JSON.stringify(updatedProjects));
          
          // Update the projects state by finding the item and updating it
          setProjects(prev => 
            prev.map(project => {
              if (project.id === projectId) {
                const { id, name, status, client_id, client_name, start_date, end_date } = project;
                return {
                  id,
                  name,
                  status: 'archived',
                  client_id,
                  client_name,
                  start_date,
                  end_date
                };
              }
              return project;
            })
          );
          
          toast({
            title: "Project archived",
            description: "The project has been archived successfully"
          });
          
          return true;
        }
        
        toast({
          title: "Error archiving project",
          description: "No projects found in localStorage",
          variant: "destructive"
        });
        
        return false;
      }
      
      // For authenticated users, use Supabase to archive the project
      const { error } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', projectId);
      
      if (error) {
        throw error;
      }
      
      // Update the projects state
      setProjects(prev => 
        prev.map(project => {
          if (project.id === projectId) {
            return { ...project, status: 'archived' };
          }
          return project;
        })
      );
      
      toast({
        title: "Project archived",
        description: "The project has been archived successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error archiving project:", error);
      
      toast({
        title: "Error archiving project",
        description: error.message,
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  return { handleArchiveProject };
}
