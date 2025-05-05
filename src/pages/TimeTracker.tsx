
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
    handleBatchTasksCreated,
    isReady,
    profile,
    isRefreshing
  } = useTimeTrackerData();
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (isReady && profile?.id) {
      console.log("Profile is ready, fetching projects");
      fetchProjects().catch(error => {
        console.error("Error fetching projects:", error);
      });
    } else {
      console.log("Profile not ready yet, waiting...");
    }
  }, [isReady, profile, fetchProjects]);
  
  useEffect(() => {
    console.log("TimeTracker rendered with:", { 
      isReady, 
      profileId: profile?.id || "none",
      projects: projects?.length || 0
    });
  }, [isReady, profile, projects]);
  
  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <TimeTrackerHeader 
          projects={projects || []}
          onProjectCreated={handleProjectCreated}
          onTaskCreated={handleTaskCreated}
          onBatchTasksCreated={handleBatchTasksCreated}
        />
        
        <TimeTrackerAlerts
          loadError={loadError}
          databaseError={databaseError}
          onProfileRefresh={handleProfileRefresh}
          onRetryProjects={fetchProjects}
          isRefreshing={isRefreshing}
        />
        
        <TimeTrackerContent
          isLoadingProjects={isLoadingProjects}
          projects={projects || []}
          tasks={tasks || {}}
          profile={profile}
          isReady={isReady}
          onProfileRefresh={handleProfileRefresh}
          isRefreshing={isRefreshing}
        />
      </div>
    </MainLayout>
  );
};

export default TimeTracker;
