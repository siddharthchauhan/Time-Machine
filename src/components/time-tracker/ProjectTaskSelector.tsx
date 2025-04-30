
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
}

const ProjectTaskSelector = ({
  projects,
  selectedProject,
  setSelectedProject,
  selectedTask,
  setSelectedTask,
  tasks
}: ProjectTaskSelectorProps) => {
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
          disabled={!selectedProject}
        >
          <SelectTrigger id="task">
            <SelectValue placeholder="Select a task" />
          </SelectTrigger>
          <SelectContent>
            {selectedProject && tasks[selectedProject as keyof typeof tasks]?.map((task) => (
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
