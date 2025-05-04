import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

type Project = {
  id: string;
  name: string;
};

type Task = {
  id: string;
  name: string;
};

interface ProjectTaskSelectorProps {
  projects: Project[];
  selectedProject: string;
  setSelectedProject: (value: string) => void;
  selectedTask: string;
  setSelectedTask: (value: string) => void;
  tasks: Record<string, Task[]>;
  disabled?: boolean;
}

const ProjectTaskSelector = ({
  projects,
  selectedProject,
  setSelectedProject,
  selectedTask,
  setSelectedTask,
  tasks: defaultTasks,
  disabled = false
}: ProjectTaskSelectorProps) => {
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const { supabase, profile } = useAuth();

  useEffect(() => {
    if (selectedProject) {
      fetchTasksForProject(selectedProject);
    } else {
      setProjectTasks([]);
    }
  }, [selectedProject]);

  const fetchTasksForProject = async (projectId: string) => {
    try {
      // First check if we have cached tasks
      if (defaultTasks && defaultTasks[projectId]) {
        setProjectTasks(defaultTasks[projectId]);
        return;
      }

      // For guest user, don't fetch from database
      if (profile?.id === 'guest') {
        // Just use whatever tasks might be in the default tasks or return empty
        const guestTasks = defaultTasks?.[projectId] || [];
        setProjectTasks(guestTasks);
        return;
      }

      // Otherwise fetch from the database
      const { data, error } = await supabase
        .from("tasks")
        .select("id, name")
        .eq("project_id", projectId);

      if (error) {
        console.error("Error fetching tasks:", error);
        return;
      }

      if (data && data.length > 0) {
        setProjectTasks(data);
      } else {
        // If no tasks found and we have default tasks, use them
        if (defaultTasks && defaultTasks[projectId]) {
          setProjectTasks(defaultTasks[projectId]);
        } else {
          setProjectTasks([]);
        }
      }
    } catch (error) {
      console.error("Error in fetchTasksForProject:", error);
    }
  };

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="project">Project</Label>
        <Select 
          value={selectedProject} 
          onValueChange={(value) => {
            setSelectedProject(value);
            setSelectedTask('');
          }}
          disabled={disabled}
        >
          <SelectTrigger id="project">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
          
      <div className="space-y-1">
        <Label htmlFor="task">Task</Label>
        <Select 
          value={selectedTask} 
          onValueChange={setSelectedTask}
          disabled={disabled || !selectedProject || projectTasks.length === 0}
        >
          <SelectTrigger id="task">
            <SelectValue placeholder={projectTasks.length === 0 ? "No tasks available" : "Select a task"} />
          </SelectTrigger>
          <SelectContent>
            {projectTasks.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default ProjectTaskSelector;
