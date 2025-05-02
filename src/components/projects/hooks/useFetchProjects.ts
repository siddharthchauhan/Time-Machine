
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Project } from "../ProjectModel";
import { useAuth } from "@/hooks/use-auth";

export function useFetchProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnectionError, setDbConnectionError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { supabase, profile, isReady } = useAuth();

  useEffect(() => {
    if (isReady && profile?.id) {
      fetchProjects();
    }
  }, [isReady, profile]);

  const fetchProjects = async () => {
    setIsLoading(true);
    setDbConnectionError(null);
    
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          id,
          name,
          description,
          client_id,
          start_date,
          end_date,
          budget_hours,
          budget_amount,
          status,
          created_at,
          updated_at,
          clients (
            id,
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        setDbConnectionError(error.message);
        throw error;
      }

      // Ensure status is cast to the correct type
      const formattedProjects = data?.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        client_id: project.client_id,
        client_name: project.clients?.name,
        start_date: project.start_date,
        end_date: project.end_date,
        budget_hours: project.budget_hours,
        budget_amount: project.budget_amount,
        status: project.status as "active" | "completed" | "onHold" | "archived",
        created_at: project.created_at,
        updated_at: project.updated_at,
      })) || [];

      setProjects(formattedProjects);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error fetching projects",
        description: error.message || "Failed to load projects from database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnection = () => {
    fetchProjects();
  };

  return {
    projects,
    setProjects,
    isLoading,
    dbConnectionError,
    fetchProjects,
    retryConnection
  };
}
