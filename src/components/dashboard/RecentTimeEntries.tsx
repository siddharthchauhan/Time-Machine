
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Eye, Trash } from "lucide-react";

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

const recentEntries: TimeEntry[] = [
  {
    id: '1',
    date: '2025-04-22',
    project: 'Website Redesign',
    task: 'Frontend Development',
    hours: 4.5,
    status: 'approved',
    description: 'Implemented responsive header and navigation'
  },
  {
    id: '2',
    date: '2025-04-21',
    project: 'Mobile App',
    task: 'UI Design',
    hours: 3,
    status: 'submitted',
    description: 'Created mockups for profile screens'
  },
  {
    id: '3',
    date: '2025-04-21',
    project: 'CRM Integration',
    task: 'API Development',
    hours: 6,
    status: 'draft',
    description: 'Working on authentication endpoints'
  },
  {
    id: '4',
    date: '2025-04-20',
    project: 'Website Redesign',
    task: 'Content Creation',
    hours: 2,
    status: 'rejected',
    description: 'Drafted new content for services page - needs revision'
  }
];

const RecentTimeEntries = () => {
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
          {recentEntries.map((entry) => (
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
                  <p className="text-xs mt-2 line-clamp-1">{entry.description}</p>
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
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline">View All Entries</Button>
      </CardFooter>
    </Card>
  );
};

export default RecentTimeEntries;
