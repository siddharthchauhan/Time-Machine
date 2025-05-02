
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Task {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  estimatedHours: number;
  priority: 'low' | 'medium' | 'high';
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-destructive';
    case 'medium':
      return 'text-warning-500';
    case 'low':
      return 'text-muted-foreground';
    default:
      return 'text-muted-foreground';
  }
};

const UpcomingTasks = () => {
  // Empty state UI for when there are no tasks
  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">No upcoming tasks</p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <CardDescription>
          Tasks that require your attention soon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {renderEmptyState()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline">View All Tasks</Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingTasks;
