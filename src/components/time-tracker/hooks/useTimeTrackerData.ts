
import { useProjects } from "./useProjects";
import { useTasks } from "./useTasks";
import { useProfileRefresh } from "./useProfileRefresh";
import { useEffect } from "react";

export const useTimeTrackerData = () => {
  const { handleProfileRefresh, loadError, isReady, profile } = useProfileRefresh();
  const { projects, isLoadingProjects, databaseError, fetchProjects, handleProjectCreated } = useProjects();
  const { tasks, handleTaskCreated } = useTasks(projects);
  
  useEffect(() => {
    console.log("useTimeTrackerData hook initialized with profile:", profile?.id || "none");
  }, [profile]);
  
  const handleBatchTasksCreated = (count: number) => {
    // This function maintains compatibility with the original interface
    console.log(`${count} tasks were batch created`);
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
