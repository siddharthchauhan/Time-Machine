
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import TimeTrackerHeader from "@/components/time-tracker/TimeTrackerHeader";
import TimeTrackerAlerts from "@/components/time-tracker/TimeTrackerAlerts";
import TimeTrackerContent from "@/components/time-tracker/TimeTrackerContent";
import { useTimeTrackerData } from "@/components/time-tracker/hooks/useTimeTrackerData";

const TimeTracker = () => {
  const {
    projects,
    tasks,
    isLoadingProjects,
    databaseError,
    loadError,
    handleProfileRefresh,
    fetchProjects,
    handleProjectCreated,
    handleTaskCreated,
    isReady,
    profile
  } = useTimeTrackerData();
  
  useEffect(() => {
    // Only fetch projects when profile is ready and loaded
    if (isReady && profile?.id) {
      console.log("Profile is ready, fetching projects");
      fetchProjects();
    } else {
      console.log("Profile not ready yet, waiting...");
    }
  }, [isReady, profile, fetchProjects]);

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <TimeTrackerHeader 
          projects={projects}
          onProjectCreated={handleProjectCreated}
          onTaskCreated={handleTaskCreated}
        />
        
        <TimeTrackerAlerts
          loadError={loadError}
          databaseError={databaseError}
          onProfileRefresh={handleProfileRefresh}
          onRetryProjects={fetchProjects}
        />
        
        <TimeTrackerContent
          isLoadingProjects={isLoadingProjects}
          projects={projects}
          tasks={tasks}
        />
      </div>
    </MainLayout>
  );
};

export default TimeTracker;
