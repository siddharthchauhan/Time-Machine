
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Project } from "../ProjectModel";

export function useFetchProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnectionError, setDbConnectionError] = useState<string | null>(null);
  const { toast } = useToast();
  const { supabase, profile, isReady } = useAuth();

  const fetchProjects = async () => {
    setIsLoading(true);
    setDbConnectionError(null);

    if (!profile?.id) {
      console.log("No profile ID available, cannot fetch projects");
      setIsLoading(false);
      setDbConnectionError("User profile not loaded. Please refresh your profile.");
      return;
    }

    try {
      console.log("Fetching projects with profile ID:", profile.id);
      
      // For guest user, use localStorage
      if (profile.id === 'guest') {
        // Get projects from localStorage if available
        const storedProjects = localStorage.getItem('guestProjects');
        if (storedProjects) {
          const parsedProjects: Project[] = JSON.parse(storedProjects);
          console.log("Loaded guest projects from localStorage:", parsedProjects.length);
          setProjects(parsedProjects);
        } else {
          // No saved projects, start with empty array
          console.log("No guest projects in localStorage, starting with empty array");
          setProjects([]);
        }
        
        setIsLoading(false);
        return;
      }
      
      // For real users, fetch from database
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      console.log("Fetched projects:", data?.length);
      
      // Convert database status string to the expected Project status type
      const typedProjects: Project[] = (data || []).map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        client_id: project.client_id,
        client_name: project.client_name,
        start_date: project.start_date,
        end_date: project.end_date,
        budget_hours: project.budget_hours,
        budget_amount: project.budget_amount,
        status: (project.status as "active" | "completed" | "onHold" | "archived"),
        created_at: project.created_at,
        updated_at: project.updated_at
      }));
      
      setProjects(typedProjects);
      
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      setDbConnectionError(error.message || "Failed to load projects from database");
      
      toast({
        title: "Error fetching projects",
        description: error.message || "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial fetch when the component mounts or profile changes
  useEffect(() => {
    if (isReady && profile?.id) {
      console.log("Profile is ready, fetching projects");
      fetchProjects();
    } else {
      console.log("Profile not ready yet:", isReady ? "ready but no profile" : "not ready");
    }
  }, [isReady, profile?.id]);

  const retryConnection = () => {
    fetchProjects();
  };

  return {
    projects,
    setProjects,
    isLoading,
    dbConnectionError,
    retryConnection
  };
}
