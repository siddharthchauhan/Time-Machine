
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
  
  // Demo projects for guest user
  const guestDemoProjects = [
    { id: "demo-project-1", name: "Demo Project" },
    { id: "demo-project-2", name: "Sample Project" },
    { id: "demo-project-3", name: "Test Project" }
  ];
  
  // Demo tasks for guest user
  const guestDemoTasks = {
    "demo-project-1": [
      { id: "demo-task-1", name: "Task 1" },
      { id: "demo-task-2", name: "Task 2" }
    ],
    "demo-project-2": [
      { id: "demo-task-3", name: "Feature Development" },
      { id: "demo-task-4", name: "Bug Fixing" }
    ],
    "demo-project-3": [
      { id: "demo-task-5", name: "Design" },
      { id: "demo-task-6", name: "Implementation" }
    ]
  };
  
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
      
      // For the guest user, provide demo projects
      if (profile.id === 'guest') {
        console.log("Using demo projects for guest user");
        setProjects(guestDemoProjects);
        setTasks(guestDemoTasks);
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
      // For guest user, don't query the database
      if (profile?.id === 'guest') {
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
