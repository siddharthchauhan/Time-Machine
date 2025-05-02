
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
  // Empty state UI for when there are no time entries
  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">No recent time entries</p>
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
          {renderEmptyState()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline">View All Entries</Button>
      </CardFooter>
    </Card>
  );
};

export default RecentTimeEntries;
