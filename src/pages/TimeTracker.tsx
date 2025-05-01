
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import TimeEntryForm from "@/components/time-tracker/TimeEntryForm";
import TimeEntriesList from "@/components/time-tracker/TimeEntriesList";
import NewProjectDialog from "@/components/time-tracker/NewProjectDialog";
import NewTaskDialog from "@/components/time-tracker/NewTaskDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const TimeTracker = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Record<string, any[]>>({});
  const { toast } = useToast();
  const { profile, supabase } = useAuth();
  
  useEffect(() => {
    // Fetch actual projects from Supabase
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
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
        toast({
          title: "Error fetching projects",
          description: error.message || "Failed to load projects",
          variant: "destructive",
        });
      }
    };
    
    fetchProjects();
  }, [supabase]);
  
  const fetchTasksForProject = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('id, name')
        .eq('project_id', projectId);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
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
    setProjects([...projects, newProject]);
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TimeEntryForm projects={projects} tasks={tasks} />
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
