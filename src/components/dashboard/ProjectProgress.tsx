
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  progress: number;
  hoursLogged: number;
  hoursEstimated: number;
  dueDate: string;
}

const ProjectProgress = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    // For now, we'll simulate loading and then set empty data
    const timer = setTimeout(() => {
      setProjects([]);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Empty state UI for when there are no projects
  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">No active projects to show</p>
      </div>
    );
  };

  // Loading state UI
  const renderLoadingState = () => {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    );
  };

  // Project list UI
  const renderProjects = () => {
    return (
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">{project.name}</h3>
              <span className="text-xs text-muted-foreground">
                Due {new Date(project.dueDate).toLocaleDateString()}
              </span>
            </div>
            <Progress value={project.progress} className="h-2" />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{project.hoursLogged} hrs logged</span>
              <span>{project.hoursEstimated} hrs estimated</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
        <CardDescription>
          Progress and time budget across your active projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? renderLoadingState() : 
          projects.length > 0 ? renderProjects() : renderEmptyState()}
      </CardContent>
    </Card>
  );
};

export default ProjectProgress;
