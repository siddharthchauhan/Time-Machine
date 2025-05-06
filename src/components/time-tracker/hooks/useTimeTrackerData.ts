
import { useProjects } from "./useProjects";
import { useTasks } from "./useTasks";
import { useProfileRefresh } from "./useProfileRefresh";

export const useTimeTrackerData = () => {
  const { handleProfileRefresh, loadError, isReady, profile } = useProfileRefresh();
  const { projects, isLoadingProjects, databaseError, fetchProjects, handleProjectCreated } = useProjects();
  const { tasks, handleTaskCreated } = useTasks(projects);
  
  const handleBatchTasksCreated = (count: number) => {
    // No need to refresh projects or tasks as these are just time entries
    // This is left empty intentionally to match the original functionality
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
    handleBatchTasksCreated,
    isReady,
    profile
  };
};
