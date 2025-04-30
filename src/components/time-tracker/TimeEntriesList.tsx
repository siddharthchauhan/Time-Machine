import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Update TimeEntryStatus to include approval states
type TimeEntryStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

interface TimeEntry {
  id: string;
  date: string;
  project: string;
  task: string;
  hours: number;
  status: TimeEntryStatus;
  description?: string;
  rejection_reason?: string | null;
}

// In the getStatusBadge function, update to include new approval states:
const getStatusBadge = (status: TimeEntryStatus) => {
  switch (status) {
    case 'draft':
      return <Badge variant="outline" className="status-badge-draft">Draft</Badge>;
    case 'submitted':
      return <Badge variant="outline" className="status-badge-submitted">Pending Approval</Badge>;
    case 'approved':
      return <Badge variant="outline" className="status-badge-approved">Approved</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="status-badge-rejected">Rejected</Badge>;
  }
};

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
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={filterProject}
                  onValueChange={setFilterProject}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {uniqueProjects.map(project => (
                      <SelectItem key={project} value={project}>{project}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filterStatus}
                  onValueChange={setFilterStatus}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center p-3 rounded-lg border bg-card">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{entry.project}</h4>
                          {getStatusBadge(entry.status)}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {entry.task}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-xs font-medium">{entry.hours} hours</p>
                        </div>
                        {entry.description && (
                          <p className="text-xs mt-2 line-clamp-2">{entry.description}</p>
                        )}
                        {entry.status === 'rejected' && entry.rejection_reason && (
                          <div className="mt-2 p-2 bg-destructive/10 rounded-sm text-xs">
                            <span className="font-medium">Rejection feedback:</span> {entry.rejection_reason}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" disabled={entry.status === 'approved'}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" disabled={entry.status === 'approved'}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No time entries found matching your filters.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="draft">
            <div className="space-y-4 mt-4">
              {timeEntries.filter(entry => entry.status === 'draft').map((entry) => (
                <div key={entry.id} className="flex items-center p-3 rounded-lg border bg-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{entry.project}</h4>
                      {getStatusBadge(entry.status)}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">{entry.task}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs font-medium">{entry.hours} hours</p>
                    </div>
                    {entry.description && (
                      <p className="text-xs mt-2 line-clamp-2">{entry.description}</p>
                    )}
                    {entry.status === 'rejected' && entry.rejection_reason && (
                      <div className="mt-2 p-2 bg-destructive/10 rounded-sm text-xs">
                        <span className="font-medium">Rejection feedback:</span> {entry.rejection_reason}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="submitted">
            <div className="space-y-4 mt-4">
              {timeEntries.filter(entry => entry.status === 'submitted').map((entry) => (
                <div key={entry.id} className="flex items-center p-3 rounded-lg border bg-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{entry.project}</h4>
                      {getStatusBadge(entry.status)}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">{entry.task}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs font-medium">{entry.hours} hours</p>
                    </div>
                    {entry.description && (
                      <p className="text-xs mt-2 line-clamp-2">{entry.description}</p>
                    )}
                    {entry.status === 'rejected' && entry.rejection_reason && (
                      <div className="mt-2 p-2 bg-destructive/10 rounded-sm text-xs">
                        <span className="font-medium">Rejection feedback:</span> {entry.rejection_reason}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="approved">
            <div className="space-y-4 mt-4">
              {timeEntries.filter(entry => entry.status === 'approved').map((entry) => (
                <div key={entry.id} className="flex items-center p-3 rounded-lg border bg-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{entry.project}</h4>
                      {getStatusBadge(entry.status)}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">{entry.task}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs font-medium">{entry.hours} hours</p>
                    </div>
                    {entry.description && (
                      <p className="text-xs mt-2 line-clamp-2">{entry.description}</p>
                    )}
                    {entry.status === 'rejected' && entry.rejection_reason && (
                      <div className="mt-2 p-2 bg-destructive/10 rounded-sm text-xs">
                        <span className="font-medium">Rejection feedback:</span> {entry.rejection_reason}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
