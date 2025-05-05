
import { useState, useEffect, useCallback } from "react";
import { Project } from "../ProjectModel";
import { supabase } from "@/integrations/supabase/client";

export function useFetchProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if we're using a guest user
      const { data: { user } } = await supabase.auth.getUser();
      const isGuestUser = !user || user.id === 'guest';
      
      if (isGuestUser) {
        console.log("Guest user - fetching projects from localStorage");
        
        // For guest users, get data from localStorage
        const storedProjects = localStorage.getItem('guestProjects');
        
        if (storedProjects) {
          try {
            const parsedProjects = JSON.parse(storedProjects);
            console.log("Loaded guest projects from localStorage:", parsedProjects.length);
            
            // Convert to Project array
            const projectList: Project[] = parsedProjects.map((project: any) => ({
              id: project.id,
              name: project.name,
              status: project.status,
              client_id: project.client_id,
              client_name: "Guest Client", // Default client name for guest projects
              start_date: project.start_date,
              end_date: project.end_date,
              created_at: project.created_at || new Date().toISOString(),
              updated_at: project.updated_at || new Date().toISOString()
            }));
            
            setProjects(projectList);
          } catch (parseErr) {
            console.error("Error parsing projects from localStorage:", parseErr);
            setError(new Error("Failed to parse projects from localStorage"));
            setProjects([]);
          }
        } else {
          console.log("No guest projects found in localStorage, initializing with empty array");
          setProjects([]);
        }
        
        setIsLoading(false);
        return;
      }
      
      // For authenticated users, fetch from Supabase
      console.log("Authenticated user - fetching projects from Supabase");
      
      // Fetch projects and include client name from the client table
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          clients (
            name
          )
        `)
        .order('updated_at', { ascending: false });
      
      if (fetchError) {
        throw fetchError;
      }
      
      console.log("Fetched projects from Supabase:", data?.length || 0);
      
      // Convert to Project array
      const projectList: Project[] = (data || []).map(project => ({
        id: project.id,
        name: project.name,
        status: project.status,
        client_id: project.client_id,
        client_name: project.clients?.name || null,
        start_date: project.start_date,
        end_date: project.end_date,
        created_at: project.created_at,
        updated_at: project.updated_at
      }));
      
      setProjects(projectList);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(err);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  return {
    projects,
    setProjects,
    isLoading,
    error,
    fetchProjects
  };
}
