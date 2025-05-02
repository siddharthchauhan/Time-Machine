
import TimeEntryForm from "./TimeEntryForm";
import TimeEntriesList from "./TimeEntriesList";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeTrackerContentProps {
  isLoadingProjects: boolean;
  projects: any[];
  tasks: Record<string, any[]>;
}

const TimeTrackerContent = ({
  isLoadingProjects,
  projects,
  tasks
}: TimeTrackerContentProps) => {
  return (
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
  );
};

export default TimeTrackerContent;
