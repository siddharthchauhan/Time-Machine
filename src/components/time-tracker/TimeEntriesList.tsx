
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TimeEntry, TimeEntryStatus } from "./types";
import TimeEntryFilters from "./TimeEntryFilters";
import TimeEntriesTabContent from "./TimeEntriesTabContent";

const TimeEntriesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const { toast } = useToast();
  const { profile } = useAuth();
  
  const filteredEntries = timeEntries.filter(entry => {
    const matchesSearch = 
      entry.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.description && entry.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    const matchesProject = filterProject === 'all' || entry.project === filterProject;
    
    return matchesSearch && matchesStatus && matchesProject;
  });
  
  // Get unique projects for filter
  const uniqueProjects = Array.from(new Set(timeEntries.map(entry => entry.project)));
  
  // Add useEffect to fetch time entries from Supabase
  useEffect(() => {
    const fetchTimeEntries = async () => {
      try {
        if (!profile) return;
        
        const { data, error } = await supabase
          .from('time_entries')
          .select(`
            id,
            date,
            project_id,
            task_id,
            hours,
            description,
            status,
            approval_status,
            rejection_reason,
            projects(name),
            tasks(name)
          `)
          .eq('user_id', profile.id)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        const formattedEntries = (data || []).map(entry => {
          // Determine the display status based on status and approval_status
          let displayStatus: TimeEntryStatus = 'draft';
          if (entry.status === 'submitted') {
            if (entry.approval_status === 'approved') {
              displayStatus = 'approved';
            } else if (entry.approval_status === 'rejected') {
              displayStatus = 'rejected';
            } else {
              displayStatus = 'submitted';
            }
          }
          
          return {
            id: entry.id,
            date: entry.date,
            project: entry.projects?.name || 'Unknown Project',
            task: entry.tasks?.name || 'General Work',
            hours: entry.hours,
            status: displayStatus,
            description: entry.description,
            rejection_reason: entry.rejection_reason
          };
        });
        
        setTimeEntries(formattedEntries);
      } catch (error: any) {
        toast({
          title: "Error fetching time entries",
          description: error.message,
          variant: "destructive"
        });
      }
    };
    
    fetchTimeEntries();
  }, [profile, toast]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Time Entries</CardTitle>
        <CardDescription>
          View and manage your time tracking history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="submitted">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="mt-4">
              <TimeEntryFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterProject={filterProject}
                setFilterProject={setFilterProject}
                uniqueProjects={uniqueProjects}
              />
              
              <TimeEntriesTabContent entries={filteredEntries} />
            </div>
          </TabsContent>
          <TabsContent value="draft">
            <TimeEntriesTabContent entries={timeEntries.filter(entry => entry.status === 'draft')} />
          </TabsContent>
          <TabsContent value="submitted">
            <TimeEntriesTabContent entries={timeEntries.filter(entry => entry.status === 'submitted')} />
          </TabsContent>
          <TabsContent value="approved">
            <TimeEntriesTabContent entries={timeEntries.filter(entry => entry.status === 'approved')} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredEntries.length} of {timeEntries.length} entries
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TimeEntriesList;
