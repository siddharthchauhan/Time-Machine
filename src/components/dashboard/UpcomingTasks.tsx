
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      
      try {
        if (profile?.id === 'guest') {
          // For guest user, check localStorage
          const storedTasks = localStorage.getItem('guestTasks');
          const storedProjects = localStorage.getItem('guestProjects');
          
          if (storedTasks && storedProjects) {
            const parsedTasks = JSON.parse(storedTasks);
            const parsedProjects = JSON.parse(storedProjects);
            
            // Flatten tasks from all projects and format them
            const allTasks: Task[] = [];
            
            Object.entries(parsedTasks).forEach(([projectId, projectTasks]: [string, any]) => {
              const project = parsedProjects.find((p: any) => p.id === projectId);
              
              if (project) {
                projectTasks.forEach((task: any) => {
                  allTasks.push({
                    id: task.id,
                    title: task.name,
                    project: project.name,
                    dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
                    estimatedHours: Math.round(Math.random() * 8 + 1),
                    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
                  });
                });
              }
            });
            
            // Sort by priority and limit to 3
            allTasks.sort((a, b) => {
              const priorityValue = { high: 3, medium: 2, low: 1 };
              return priorityValue[b.priority] - priorityValue[a.priority];
            });
            
            setTasks(allTasks.slice(0, 3));
          }
        } else if (profile?.id) {
          // For authenticated users, fetch from database
          const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select(`
              id, 
              name,
              project_id,
              projects(name)
            `)
            .order('created_at', { ascending: false })
            .limit(3);
            
          if (tasksError) {
            console.error("Error fetching tasks:", tasksError);
            throw tasksError;
          }
          
          if (tasksData && tasksData.length > 0) {
            const formattedTasks: Task[] = tasksData.map(task => ({
              id: task.id,
              title: task.name,
              project: task.projects?.name || 'Unknown Project',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
              estimatedHours: 4, // Default estimate
              priority: 'medium' as 'low' | 'medium' | 'high'
            }));
            
            setTasks(formattedTasks);
          }
        }
      } catch (error) {
        console.error("Error in fetchTasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [profile]);

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
        <Button 
          variant="outline" 
          onClick={() => navigate('/time-tracker')}
        >
          View All Tasks
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingTasks;
