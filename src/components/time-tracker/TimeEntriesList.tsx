
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TimeEntry, TimeEntryStatus } from "./types";
import TimeEntryFilters from "./TimeEntryFilters";
import TimeEntriesTabContent from "./TimeEntriesTabContent";
import { RefreshCw } from "lucide-react";

const TimeEntriesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  
  const fetchTimeEntries = async () => {
    console.log("Fetching time entries for user:", profile?.id);
    setIsLoading(true);
    
    try {
      if (!profile) {
        setIsLoading(false);
        return;
      }
      
      // Check if we're using a guest profile
      if (profile.id === 'guest') {
        // Get time entries from localStorage
        const storedEntries = localStorage.getItem('guestTimeEntries');
        
        if (storedEntries) {
          const parsedEntries = JSON.parse(storedEntries);
          console.log("Guest time entries loaded from localStorage:", parsedEntries.length);
          
          // Map entries to the expected format
          const formattedEntries = parsedEntries.map((entry: any) => {
            let displayStatus: TimeEntryStatus = entry.status as TimeEntryStatus;
            if (entry.status === 'submitted') {
              displayStatus = entry.approval_status === 'approved' 
                ? 'approved' 
                : entry.approval_status === 'rejected' 
                  ? 'rejected' 
                  : 'submitted';
            }
            
            // Get project and task names from localStorage
            const projects = JSON.parse(localStorage.getItem('guestProjects') || '[]');
            const tasks = JSON.parse(localStorage.getItem('guestTasks') || '{}');
            
            const project = projects.find((p: any) => p.id === entry.project_id)?.name || 'Unknown Project';
            const taskList = tasks[entry.project_id] || [];
            const task = taskList.find((t: any) => t.id === entry.task_id)?.name || 'General Work';
            
            return {
              id: entry.id,
              date: entry.date,
              project: project,
              task: task,
              hours: entry.hours,
              status: displayStatus,
              description: entry.description,
              rejection_reason: entry.rejection_reason
            };
          });
          
          setTimeEntries(formattedEntries);
        } else {
          // Use mock data for demonstration if no stored entries
          console.log("No stored time entries found for guest, using mock data");
          setTimeEntries([
            {
              id: '1',
              date: new Date().toISOString().split('T')[0],
              project: 'Demo Project',
              task: 'UI Development',
              hours: 3.5,
              status: 'draft',
              description: 'Working on responsive design'
            },
            {
              id: '2',
              date: new Date().toISOString().split('T')[0],
              project: 'Demo Project',
              task: 'Backend Integration',
              hours: 2,
              status: 'submitted',
              description: 'Setting up API endpoints'
            },
            {
              id: '3',
              date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
              project: 'Marketing Website',
              task: 'Content Writing',
              hours: 1.5,
              status: 'approved',
              description: 'Creating landing page copy'
            }
          ]);
        }
        
        setIsLoading(false);
        return;
      }
      
      // For authenticated users, fetch from database
      console.log("Fetching time entries from database for user:", profile.id);
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
        
      if (error) {
        console.error("Error fetching time entries:", error);
        throw error;
      }
      
      console.log("Time entries fetched:", data?.length || 0);
      
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
        } else {
          displayStatus = entry.status as TimeEntryStatus;
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
      console.error("Error in fetchTimeEntries:", error);
      toast({
        title: "Error fetching time entries",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch time entries when component mounts or profile changes
  useEffect(() => {
    fetchTimeEntries();
  }, [profile]);
  
  // Function to handle manual refresh
  const handleRefresh = () => {
    fetchTimeEntries();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>My Time Entries</CardTitle>
          <CardDescription>
            View and manage your time tracking history
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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
              
              <TimeEntriesTabContent entries={filteredEntries} isLoading={isLoading} />
            </div>
          </TabsContent>
          <TabsContent value="draft">
            <TimeEntriesTabContent 
              entries={timeEntries.filter(entry => entry.status === 'draft')} 
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="submitted">
            <TimeEntriesTabContent 
              entries={timeEntries.filter(entry => entry.status === 'submitted')} 
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="approved">
            <TimeEntriesTabContent 
              entries={timeEntries.filter(entry => entry.status === 'approved')} 
              isLoading={isLoading}
            />
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
