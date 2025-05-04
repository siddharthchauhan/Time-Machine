
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const { toast } = useToast();
  const { profile, supabase, isReady, forceRefreshProfile } = useAuth();

  const fetchProjects = useCallback(async (): Promise<void> => {
    setIsLoadingProjects(true);
    setDatabaseError(null);
    
    if (!profile?.id) {
      console.log("No profile ID available, cannot fetch projects");
      setIsLoadingProjects(false);
      setDatabaseError("User profile not loaded. Please refresh your profile.");
      return;
    }
    
    try {
      console.log("Fetching projects with profile ID:", profile.id);
      
      // For guest user, use localStorage
      if (profile.id === 'guest') {
        // Get projects from localStorage if available
        const storedProjects = localStorage.getItem('guestProjects');
        if (storedProjects) {
          const parsedProjects = JSON.parse(storedProjects);
          console.log("Loaded guest projects from localStorage:", parsedProjects.length);
          setProjects(parsedProjects);
        } else {
          // No saved projects, start with empty array
          console.log("No guest projects in localStorage, starting with empty array");
          setProjects([]);
        }
          
        setIsLoadingProjects(false);
        return;
      }
      
      // For real users, fetch from database
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .order('name');
          
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log("Fetched projects:", data.length);
        setProjects(data);
      } else {
        console.log("No projects found or empty data array");
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      setDatabaseError(error.message || "Failed to load projects from database");
      toast({
        title: "Error fetching projects",
        description: error.message || "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProjects(false);
    }
  }, [profile, supabase, toast]);

  const handleProjectCreated = (newProject: { id: string; name: string }) => {
    console.log("Project created:", newProject);
    
    // Update the projects state
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    
    // For guest user, save to localStorage
    if (profile?.id === 'guest') {
      localStorage.setItem('guestProjects', JSON.stringify(updatedProjects));
    }
    
    toast({
      title: "Project created",
      description: `${newProject.name} has been successfully added`,
    });
  };

  // Run initial fetch when profile is ready
  useEffect(() => {
    if (isReady && profile?.id) {
      console.log("Profile is ready, fetching projects");
      fetchProjects();
    } else {
      console.log("Profile not ready yet:", isReady ? "ready but no profile" : "not ready");
    }
  }, [isReady, profile, fetchProjects]);

  return {
    projects,
    isLoadingProjects,
    databaseError,
    fetchProjects,
    handleProjectCreated
  };
};
