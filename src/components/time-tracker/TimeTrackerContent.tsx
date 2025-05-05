
import { useState } from "react";
import { Grid2X2, ListPlus, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeEntryForm from "./TimeEntryForm";
import TimeEntriesList from "./TimeEntriesList";
import { ProjectSkeleton } from "@/components/ui/skeleton";

interface TimeTrackerContentProps {
  isLoadingProjects: boolean;
  projects: any[];
  tasks: Record<string, any[]>;
}

const TimeTrackerContent = ({ isLoadingProjects, projects, tasks }: TimeTrackerContentProps) => {
  const [refreshTimeEntries, setRefreshTimeEntries] = useState(0);
  
  // Force a refresh of the time entries list
  const handleEntrySubmitted = () => {
    setRefreshTimeEntries(prev => prev + 1);
  };
  
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
          {isLoadingProjects ? (
            <ProjectSkeleton />
          ) : (
            <TimeEntryForm 
              projects={projects} 
              tasks={tasks} 
              onEntrySubmitted={handleEntrySubmitted}
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
