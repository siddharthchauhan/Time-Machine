
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    // For now, we'll simulate loading and then set empty data
    const timer = setTimeout(() => {
      setTasks([]);
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Empty state UI for when there are no tasks
  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">No upcoming tasks</p>
      </div>
    );
  };

  // Loading state UI
  const renderLoadingState = () => {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  };

  // Task list UI
  const renderTasks = () => {
    return (
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="p-3 border rounded-md">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-sm">{task.title}</h4>
              <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
              <p className="text-xs text-muted-foreground">{task.project}</p>
              <p className="text-xs text-muted-foreground">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="text-xs">{task.estimatedHours}h est.</p>
            </div>
          </div>
        ))}
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
          {isLoading ? renderLoadingState() : 
            tasks.length > 0 ? renderTasks() : renderEmptyState()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline">View All Tasks</Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingTasks;
