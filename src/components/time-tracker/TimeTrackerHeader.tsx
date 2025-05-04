
import NewTaskDialog from "./NewTaskDialog";
import NewProjectDialog from "./NewProjectDialog";
import BatchTaskCreationDialog from "./BatchTaskCreationDialog";
import { useAuth } from "@/hooks/use-auth";
import { isManager, canCreateTasks, canCreateProjects } from "@/lib/permissions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const userCanCreateProjects = canCreateProjects(profile);
  const userCanCreateTasks = canCreateTasks(profile);

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Time Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Record and manage your time entries for projects and tasks.
        </p>
      </div>
      <div className="flex items-center space-x-3">
        {userCanCreateTasks && (
          <>
            <NewTaskDialog projects={projects} onTaskCreated={onTaskCreated} />
            <BatchTaskCreationDialog projects={projects} onTasksCreated={onBatchTasksCreated} />
          </>
        )}
        
        {userCanCreateProjects ? (
          <NewProjectDialog onProjectCreated={onProjectCreated} />
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="inline-flex items-center justify-center h-10 px-4 py-2 opacity-60 cursor-not-allowed bg-muted text-muted-foreground rounded-md">
                  New Project
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Only managers can create new projects</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default TimeTrackerHeader;
