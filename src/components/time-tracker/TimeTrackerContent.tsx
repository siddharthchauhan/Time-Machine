
import { useState, useEffect } from "react";
import { Grid2X2, ListPlus, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import TimeEntryForm from "./TimeEntryForm";
import TimeEntriesList from "./TimeEntriesList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { UserProfile } from "@/lib/auth";

interface TimeTrackerContentProps {
  isLoadingProjects: boolean;
  projects: any[];
  tasks: Record<string, any[]>;
  profile: UserProfile | null;
  isReady: boolean;
  onProfileRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

const TimeTrackerContent = ({ 
  isLoadingProjects, 
  projects, 
  tasks, 
  profile,
  isReady,
  onProfileRefresh,
  isRefreshing
}: TimeTrackerContentProps) => {
  const [refreshTimeEntries, setRefreshTimeEntries] = useState(0);
  const [profileLoaded, setProfileLoaded] = useState(false);
  
  // Force a refresh of the time entries list
  const handleEntrySubmitted = () => {
    setRefreshTimeEntries(prev => prev + 1);
  };
  
  useEffect(() => {
    setProfileLoaded(!!profile?.id && isReady);
    
    console.log("TimeTrackerContent rendered with:", {
      projects: projects?.length || 0,
      profile: profile?.id || "none",
      isLoading: isLoadingProjects,
      isReady,
      profileLoaded: !!profile?.id && isReady
    });
  }, [projects, profile, isLoadingProjects, isReady]);
  
  return (
    <div>
      <Tabs defaultValue="entry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entry" className="flex gap-1 items-center">
            <ListPlus className="h-4 w-4" />
            New Entry
          </TabsTrigger>
          <TabsTrigger value="list" className="flex gap-1 items-center">
            <LayoutList className="h-4 w-4" />
            My Entries
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="entry" className="space-y-4">
          {!profileLoaded && (
            <Alert variant="destructive" className="mb-4 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-amber-600">Profile data not loaded</AlertTitle>
              <div className="flex items-center justify-between">
                <AlertDescription className="text-amber-600">
                  Your profile is required to track time.
                </AlertDescription>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onProfileRefresh}
                  className="ml-2 h-8"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh Profile'}
                </Button>
              </div>
            </Alert>
          )}

          {isLoadingProjects ? (
            <div className="p-4 border rounded-lg space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
              <div className="flex space-x-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          ) : (
            <TimeEntryForm 
              projects={projects || []} 
              tasks={tasks || {}} 
              onEntrySubmitted={handleEntrySubmitted}
              profileLoaded={profileLoaded}
              onProfileRefresh={onProfileRefresh}
              isRefreshing={isRefreshing}
            />
          )}
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          <TimeEntriesList key={`time-entries-${refreshTimeEntries}`} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeTrackerContent;
