
import NewTaskDialog from "./NewTaskDialog";
import NewProjectDialog from "./NewProjectDialog";
import BatchTaskCreationDialog from "./BatchTaskCreationDialog";
import { useAuth } from "@/hooks/use-auth";
import { isManager } from "@/lib/permissions";

interface TimeTrackerHeaderProps {
  projects: any[];
  onProjectCreated: (project: { id: string; name: string }) => void;
  onTaskCreated: (task: { id: string; name: string; projectId: string }) => void;
  onBatchTasksCreated?: (count: number) => void;
}

const TimeTrackerHeader = ({
  projects,
  onProjectCreated,
  onTaskCreated,
  onBatchTasksCreated = () => {}
}: TimeTrackerHeaderProps) => {
  const { profile } = useAuth();
  const canCreateProjects = isManager(profile);

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Time Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Record and manage your time entries for projects and tasks.
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <NewTaskDialog projects={projects} onTaskCreated={onTaskCreated} />
        <BatchTaskCreationDialog projects={projects} onTasksCreated={onBatchTasksCreated} />
        {canCreateProjects && <NewProjectDialog onProjectCreated={onProjectCreated} />}
      </div>
    </div>
  );
};

export default TimeTrackerHeader;
