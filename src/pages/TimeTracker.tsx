
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import TimeEntryForm from "@/components/time-tracker/TimeEntryForm";
import TimeEntriesList from "@/components/time-tracker/TimeEntriesList";
import NewProjectDialog from "@/components/time-tracker/NewProjectDialog";
import NewTaskDialog from "@/components/time-tracker/NewTaskDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const TimeTracker = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Record<string, any[]>>({});
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const { toast } = useToast();
  const { profile, supabase, isReady } = useAuth();
  
  useEffect(() => {
    // Only fetch projects when the profile is loaded
    if (isReady && profile?.id) {
      fetchProjects();
    }
  }, [isReady, profile]);
  
  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    setDatabaseError(null);
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
  };
  
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

  const handleRefresh = () => {
    if (isReady && profile?.id) {
      fetchProjects();
    } else {
      window.location.reload();
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Time Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Record and manage your time entries for projects and tasks.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <NewTaskDialog projects={projects} onTaskCreated={handleTaskCreated} />
            <NewProjectDialog onProjectCreated={handleProjectCreated} />
          </div>
        </div>
        
        {databaseError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex justify-between items-center">
              <span>Database error: {databaseError}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="ml-2"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            {isLoadingProjects ? (
              <Skeleton className="w-full h-[500px] rounded-lg" />
            ) : (
              <TimeEntryForm projects={projects} tasks={tasks} />
            )}
          </div>
          <div className="lg:col-span-2">
            <TimeEntriesList />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TimeTracker;
