
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type TimeEntryStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

interface TimeEntry {
  id: string;
  date: string;
  project: string;
  task: string;
  hours: number;
  status: TimeEntryStatus;
  description?: string;
}

const getStatusBadge = (status: TimeEntryStatus) => {
  switch (status) {
    case 'draft':
      return <Badge variant="outline" className="status-badge-draft">Draft</Badge>;
    case 'submitted':
      return <Badge variant="outline" className="status-badge-submitted">Submitted</Badge>;
    case 'approved':
      return <Badge variant="outline" className="status-badge-approved">Approved</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="status-badge-rejected">Rejected</Badge>;
  }
};

const RecentTimeEntries = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentEntries = async () => {
      setIsLoading(true);
      
      try {
        if (profile?.id === 'guest') {
          // For guest user, check localStorage
          const storedEntries = localStorage.getItem('guestTimeEntries');
          
          if (storedEntries) {
            const parsedEntries = JSON.parse(storedEntries);
            const storedProjects = localStorage.getItem('guestProjects');
            const storedTasks = localStorage.getItem('guestTasks');
            
            const parsedProjects = storedProjects ? JSON.parse(storedProjects) : [];
            const parsedTasks = storedTasks ? JSON.parse(storedTasks) : {};
            
            // Format and sort by date
            const formattedEntries = parsedEntries
              .map((entry: any) => {
                const project = parsedProjects.find((p: any) => p.id === entry.project_id);
                const projectTasks = parsedTasks[entry.project_id] || [];
                const task = projectTasks.find((t: any) => t.id === entry.task_id);
                
                // Determine status
                let status: TimeEntryStatus = 'draft';
                if (entry.status === 'submitted') {
                  if (entry.approval_status === 'approved') {
                    status = 'approved';
                  } else if (entry.approval_status === 'rejected') {
                    status = 'rejected';
                  } else {
                    status = 'submitted';
                  }
                } else {
                  status = entry.status as TimeEntryStatus;
                }
                
                return {
                  id: entry.id,
                  date: entry.date,
                  project: project?.name || 'Unknown Project',
                  task: task?.name || 'General Work',
                  hours: entry.hours,
                  status,
                  description: entry.description
                };
              })
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5); // Get most recent 5
              
            setEntries(formattedEntries);
          }
        } else if (profile?.id) {
          // For authenticated users, fetch from database
          const { data: entriesData, error: entriesError } = await supabase
            .from('time_entries')
            .select(`
              id,
              date,
              hours,
              description,
              status,
              approval_status,
              projects(name),
              tasks(name)
            `)
            .eq('user_id', profile.id)
            .order('date', { ascending: false })
            .limit(5);
            
          if (entriesError) {
            console.error("Error fetching time entries:", entriesError);
            throw entriesError;
          }
          
          if (entriesData && entriesData.length > 0) {
            const formattedEntries = entriesData.map(entry => {
              // Determine display status
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
                description: entry.description
              };
            });
            
            setEntries(formattedEntries);
          }
        }
      } catch (error) {
        console.error("Error in fetchRecentEntries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentEntries();
  }, [profile]);

  // Empty state UI for when there are no time entries
  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">No recent time entries</p>
      </div>
    );
  };

  // Loading state UI
  const renderLoadingState = () => {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    );
  };

  // Time entries list UI
  const renderTimeEntries = () => {
    return (
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="border-b pb-3 last:border-0 last:pb-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{entry.project}</h4>
              {getStatusBadge(entry.status)}
            </div>
            <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <p className="text-xs text-muted-foreground">{entry.task}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(entry.date).toLocaleDateString()}
              </p>
              <p className="text-xs font-medium">{entry.hours} hours</p>
            </div>
            {entry.description && (
              <p className="mt-1 text-xs line-clamp-2">{entry.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Time Entries</CardTitle>
        <CardDescription>
          Your most recent time tracking activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? renderLoadingState() : 
            entries.length > 0 ? renderTimeEntries() : renderEmptyState()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          variant="outline"
          onClick={() => navigate('/time-tracker')}
        >
          View All Entries
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentTimeEntries;
