
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useTimeTrackerData = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Record<string, any[]>>({});
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const { toast } = useToast();
  const { profile, supabase, isReady, loadError, forceRefreshProfile } = useAuth();
  
  // Run profile refresh when component mounts if no profile is available
  useEffect(() => {
    if (!isReady && !profile?.id) {
      console.log("Profile not ready on mount, trying to refresh");
      forceRefreshProfile().catch(error => {
        console.error("Initial profile refresh failed:", error);
      });
    }
  }, []);
  
  // Function to refresh profile and retry project loading
  const handleProfileRefresh = useCallback(async () => {
    console.log("Attempting to refresh profile");
    try {
      const success = await forceRefreshProfile();
      if (success) {
        toast({
          title: "Profile refreshed",
          description: "Your profile has been successfully loaded.",
        });
        fetchProjects();
      } else {
        toast({
          title: "Profile refresh failed",
          description: "Please try signing out and signing back in.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Profile refresh error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  }, [forceRefreshProfile, toast]);
  
  const fetchProjects = useCallback(async () => {
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
      
      // For the guest user, we need special handling
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
          
        // Get tasks from localStorage if available
        const storedTasks = localStorage.getItem('guestTasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
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
        
        // For each project, fetch tasks
        data.forEach(project => {
          fetchTasksForProject(project.id);
        });
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
  
  useEffect(() => {
    if (isReady && profile?.id) {
      console.log("Profile is ready, fetching projects");
      fetchProjects();
    } else {
      console.log("Profile not ready yet:", isReady ? "ready but no profile" : "not ready");
    }
  }, [isReady, profile, fetchProjects]);
  
  const fetchTasksForProject = async (projectId: string) => {
    if (!projectId) {
      console.warn("Attempted to fetch tasks with invalid projectId:", projectId);
      return;
    }

    try {
      // For guest user, check localStorage
      if (profile?.id === 'guest') {
        const storedTasks = localStorage.getItem('guestTasks');
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks);
          if (parsedTasks[projectId]) {
            setTasks(prev => ({
              ...prev,
              [projectId]: parsedTasks[projectId]
            }));
          }
        }
        return;
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .select('id, name')
        .eq('project_id', projectId);
        
      if (error) {
        console.error(`Error fetching tasks for project ${projectId}:`, error);
        return;
      }
      
      if (data && data.length > 0) {
        console.log(`Tasks for project ${projectId}:`, data.length);
        setTasks(prev => ({
          ...prev,
          [projectId]: data
        }));
      }
    } catch (error: any) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
    }
  };
  
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
  
  const handleTaskCreated = (newTask: { id: string; name: string; projectId: string }) => {
    console.log("Task created:", newTask);
    
    // Update the tasks state
    const projectTasks = tasks[newTask.projectId] || [];
    const updatedTasks = {
      ...tasks,
      [newTask.projectId]: [...projectTasks, { id: newTask.id, name: newTask.name }]
    };
    setTasks(updatedTasks);
    
    // For guest user, save to localStorage
    if (profile?.id === 'guest') {
      localStorage.setItem('guestTasks', JSON.stringify(updatedTasks));
    }
    
    toast({
      title: "Task added",
      description: `${newTask.name} has been added to the selected project`,
    });
  };

  return {
    projects,
    tasks,
    isLoadingProjects,
    databaseError,
    loadError,
    handleProfileRefresh,
    fetchProjects,
    handleProjectCreated,
    handleTaskCreated,
    isReady,
    profile
  };
};
