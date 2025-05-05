
import { useState } from "react";
import { Project, ProjectFormValues } from "../../ProjectModel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useCreateProject(
  projects: Project[], 
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) {
  const { toast } = useToast();
  
  const handleCreateProject = async (values: ProjectFormValues): Promise<boolean> => {
    console.log("Creating project with values:", values);
    
    try {
      // Check if we're using a guest user
      const { data: { user } } = await supabase.auth.getUser();
      const isGuestUser = !user || user.id === 'guest';
      
      if (isGuestUser) {
        // For guest users, store in localStorage
        console.log("Guest user - creating project in localStorage");
        
        // Create a new project with a unique ID
        const newProject = {
          id: crypto.randomUUID(),
          name: values.name,
          description: values.description,
          status: values.status,
          client_id: values.client_id,
          start_date: values.start_date,
          end_date: values.end_date,
          budget_amount: parseFloat(values.budget_amount || '0'),
          budget_hours: parseFloat(values.budget_hours || '0'),
          created_by: 'guest',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Get existing projects from localStorage or initialize empty array
        const existingProjects = localStorage.getItem('guestProjects') 
          ? JSON.parse(localStorage.getItem('guestProjects')!) 
          : [];
        
        // Add new project and save to localStorage
        localStorage.setItem('guestProjects', JSON.stringify([...existingProjects, newProject]));
        
        // Update the projects state
        // We need to create a Project object from the form values
        const newProjectForState: Project = {
          id: newProject.id,
          name: values.name,
          status: values.status,
          client_id: values.client_id,
          client_name: "Guest Client", // Default client name for guest user
          start_date: values.start_date,
          end_date: values.end_date
        };
        
        setProjects(prev => [...prev, newProjectForState]);
        
        toast({
          title: "Project created",
          description: "Your project has been created successfully"
        });
        
        return true;
      }
      
      // For authenticated users, create a project in the database
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: values.name,
          description: values.description,
          status: values.status,
          client_id: values.client_id,
          start_date: values.start_date,
          end_date: values.end_date,
          budget_amount: values.budget_amount ? parseFloat(values.budget_amount) : null,
          budget_hours: values.budget_hours ? parseFloat(values.budget_hours) : null,
          created_by: user.id
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log("Project created in Supabase:", data);
      
      if (data && data.length > 0) {
        // Get the client name if a client was selected
        let clientName = "";
        if (values.client_id) {
          const { data: clientData } = await supabase
            .from('clients')
            .select('name')
            .eq('id', values.client_id)
            .single();
            
          if (clientData) {
            clientName = clientData.name;
          }
        }
        
        // Update the projects state with the new project
        const newProject: Project = {
          id: data[0].id,
          name: values.name,
          status: values.status,
          client_id: values.client_id,
          client_name: clientName,
          start_date: values.start_date,
          end_date: values.end_date
        };
        
        setProjects(prev => [...prev, newProject]);
        
        toast({
          title: "Project created",
          description: "Your project has been created successfully"
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Error creating project:", error);
      
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  return { handleCreateProject };
}
