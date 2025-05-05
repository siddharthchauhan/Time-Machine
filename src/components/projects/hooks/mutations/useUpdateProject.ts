
import { Project, ProjectFormValues } from "../../ProjectModel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useUpdateProject(
  projects: Project[], 
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) {
  const { toast } = useToast();
  
  const handleUpdateProject = async (projectId: string, values: ProjectFormValues): Promise<boolean> => {
    console.log("Updating project:", projectId, "with values:", values);
    
    try {
      // Check if we're using a guest user
      const { data: { user } } = await supabase.auth.getUser();
      const isGuestUser = !user || user.id === 'guest';
      
      if (isGuestUser) {
        // For guest users, update in localStorage
        console.log("Guest user - updating project in localStorage");
        
        // Get existing projects from localStorage
        const existingProjects = localStorage.getItem('guestProjects');
        
        if (existingProjects) {
          const parsedProjects = JSON.parse(existingProjects);
          
          // Find and update the project
          const updatedProjects = parsedProjects.map((project: any) => {
            if (project.id === projectId) {
              return {
                ...project,
                name: values.name,
                description: values.description,
                status: values.status,
                client_id: values.clientId,
                start_date: values.startDate,
                end_date: values.endDate,
                budget_amount: parseFloat(values.budgetAmount?.toString() || '0'),
                budget_hours: parseFloat(values.budgetHours?.toString() || '0'),
                updated_at: new Date().toISOString()
              };
            }
            return project;
          });
          
          // Save to localStorage
          localStorage.setItem('guestProjects', JSON.stringify(updatedProjects));
          
          // Update the projects state
          setProjects(prev => 
            prev.map(project => {
              if (project.id === projectId) {
                // Find the current project to preserve its other properties
                const currentProject = prev.find(p => p.id === projectId);
                const clientName = currentProject?.client_name || "Guest Client";
                
                return {
                  ...currentProject!, // Copy all existing properties
                  name: values.name,
                  description: values.description,
                  status: values.status,
                  client_id: values.clientId,
                  client_name: clientName,
                  start_date: values.startDate,
                  end_date: values.endDate,
                  budget_hours: values.budgetHours,
                  budget_amount: values.budgetAmount,
                  updated_at: new Date().toISOString()
                };
              }
              return project;
            })
          );
          
          toast({
            title: "Project updated",
            description: "Your project has been updated successfully"
          });
          
          return true;
        }
        
        toast({
          title: "Error updating project",
          description: "No projects found in localStorage",
          variant: "destructive"
        });
        
        return false;
      }
      
      // For authenticated users, update in the database
      const { error } = await supabase
        .from('projects')
        .update({
          name: values.name,
          description: values.description,
          status: values.status,
          client_id: values.clientId,
          start_date: values.startDate,
          end_date: values.endDate,
          budget_amount: values.budgetAmount ? parseFloat(values.budgetAmount.toString()) : null,
          budget_hours: values.budgetHours ? parseFloat(values.budgetHours.toString()) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);
      
      if (error) {
        throw error;
      }
      
      // Get the client name if a client was selected
      let clientName = "";
      if (values.clientId) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('name')
          .eq('id', values.clientId)
          .single();
          
        if (clientData) {
          clientName = clientData.name;
        }
      }
      
      // Update the projects state 
      setProjects(prev => 
        prev.map(project => {
          if (project.id === projectId) {
            // Find the current project to preserve its other properties
            const currentProject = prev.find(p => p.id === projectId);
            
            return {
              ...currentProject!, // Copy all existing properties
              name: values.name,
              description: values.description,
              status: values.status,
              client_id: values.clientId,
              client_name: clientName || currentProject?.client_name,
              start_date: values.startDate,
              end_date: values.endDate,
              budget_hours: values.budgetHours,
              budget_amount: values.budgetAmount,
              updated_at: new Date().toISOString()
            };
          }
          return project;
        })
      );
      
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating project:", error);
      
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  return { handleUpdateProject };
}
