
import { useProjects } from "./useProjects";
import { useTasks } from "./useTasks";
import { useProfileRefresh } from "./useProfileRefresh";
import { useEffect, useState } from "react";

export const useTimeTrackerData = () => {
  const { handleProfileRefresh, loadError, isReady, profile, isRefreshing } = useProfileRefresh();
  const { projects, isLoadingProjects, databaseError, fetchProjects, handleProjectCreated } = useProjects();
  const { tasks, handleTaskCreated } = useTasks(projects);
  const [profileLoaded, setProfileLoaded] = useState(false);
  
  useEffect(() => {
    console.log("useTimeTrackerData hook initialized with profile:", profile?.id || "none");
    
    // Check if profile is loaded successfully
    if (profile?.id && isReady) {
      console.log("Profile loaded successfully, setting profileLoaded to true");
      setProfileLoaded(true);
      
      // Fetch projects when profile is ready
      fetchProjects().catch(err => {
        console.error("Error fetching projects after profile load:", err);
      });
    } else {
      console.log("Profile not loaded yet:", isReady ? "ready but no profile" : "not ready");
      setProfileLoaded(false);
    }
  }, [profile, isReady, fetchProjects]);
  
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
    profile,
    profileLoaded,
    isRefreshing
  };
};
