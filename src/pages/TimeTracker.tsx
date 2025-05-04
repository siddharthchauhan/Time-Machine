
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import TimeTrackerHeader from "@/components/time-tracker/TimeTrackerHeader";
import TimeTrackerAlerts from "@/components/time-tracker/TimeTrackerAlerts";
import TimeTrackerContent from "@/components/time-tracker/TimeTrackerContent";
import { useTimeTrackerData } from "@/components/time-tracker/hooks/useTimeTrackerData";
import { useToast } from "@/hooks/use-toast";

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
  
  const { toast } = useToast();
  
  useEffect(() => {
    // Only fetch projects when profile is ready and loaded
    if (isReady && profile?.id) {
      console.log("Profile is ready, fetching projects");
      fetchProjects();
    } else {
      console.log("Profile not ready yet, waiting...");
    }
  }, [isReady, profile, fetchProjects]);
  
  const handleBatchTasksCreated = (count: number) => {
    toast({
      title: "Batch Creation Successful",
      description: `${count} time entries have been created.`,
    });
    // No need to refresh projects or tasks as these are just time entries
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <TimeTrackerHeader 
          projects={projects}
          onProjectCreated={handleProjectCreated}
          onTaskCreated={handleTaskCreated}
          onBatchTasksCreated={handleBatchTasksCreated}
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
