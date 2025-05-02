
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useTimeTrackerData = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Record<string, any[]>>({});
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const { toast } = useToast();
  const { profile, supabase, isReady, loadError, forceRefreshProfile } = useAuth();
  
  // Function to refresh profile and retry project loading
  const handleProfileRefresh = useCallback(async () => {
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
  
  const fetchTasksForProject = async (projectId: string) => {
    if (!projectId) {
      console.warn("Attempted to fetch tasks with invalid projectId:", projectId);
      return;
    }

    try {
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
    setProjects(prevProjects => [...prevProjects, newProject]);
    toast({
      title: "Project created",
      description: `${newProject.name} has been successfully added`,
    });
  };
  
  const handleTaskCreated = (newTask: { id: string; name: string; projectId: string }) => {
    console.log("Task created:", newTask);
    // Update the tasks state with the new task
    setTasks(prev => {
      const projectTasks = prev[newTask.projectId] || [];
      return {
        ...prev,
        [newTask.projectId]: [...projectTasks, { id: newTask.id, name: newTask.name }]
      };
    });
    
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
