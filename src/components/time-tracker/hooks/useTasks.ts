
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useTasks = (projects: any[]) => {
  const [tasks, setTasks] = useState<Record<string, any[]>>({});
  const { toast } = useToast();
  const { profile, supabase } = useAuth();

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

  // Fetch tasks for each project when projects change
  useEffect(() => {
    if (projects.length > 0) {
      projects.forEach(project => {
        fetchTasksForProject(project.id);
      });
    }
  }, [projects]);

  return {
    tasks,
    fetchTasksForProject,
    handleTaskCreated
  };
};
