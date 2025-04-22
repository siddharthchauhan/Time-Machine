
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";

interface Task {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  estimatedHours: number;
  priority: 'low' | 'medium' | 'high';
}

const tasks: Task[] = [
  {
    id: '1',
    title: 'Complete homepage design',
    project: 'Website Redesign',
    dueDate: '2025-04-24',
    estimatedHours: 6,
    priority: 'high'
  },
  {
    id: '2',
    title: 'User profile API endpoints',
    project: 'CRM Integration',
    dueDate: '2025-04-25',
    estimatedHours: 8,
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Create wireframes for new features',
    project: 'Mobile App',
    dueDate: '2025-04-26',
    estimatedHours: 4,
    priority: 'medium'
  }
];

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
          {tasks.map((task) => (
            <div key={task.id} className="flex flex-col p-3 rounded-lg border">
              <div className="flex justify-between">
                <h4 className="font-medium text-sm">{task.title}</h4>
                <span className={`text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{task.project}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    {new Date(task.dueDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{task.estimatedHours} hours</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline">View All Tasks</Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingTasks;
