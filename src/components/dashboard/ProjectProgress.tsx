
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

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
  const { profile } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      
      try {
        if (profile?.id === 'guest') {
          // For guest user, check localStorage
          const storedProjects = localStorage.getItem('guestProjects');
          const storedEntries = localStorage.getItem('guestTimeEntries');
          
          if (storedProjects) {
            const parsedProjects = JSON.parse(storedProjects);
            const parsedEntries = storedEntries ? JSON.parse(storedEntries) : [];
            
            // Calculate hours logged per project
            const projectHours: Record<string, number> = {};
            parsedEntries.forEach((entry: any) => {
              if (!projectHours[entry.project_id]) {
                projectHours[entry.project_id] = 0;
              }
              projectHours[entry.project_id] += Number(entry.hours);
            });
            
            // Map projects with logged hours
            const projectsWithProgress = parsedProjects
              .slice(0, 3) // Limit to 3 projects for display
              .map((project: any) => ({
                id: project.id,
                name: project.name,
                progress: Math.min(Math.round((projectHours[project.id] || 0) / 40 * 100), 100), // Assume 40h is 100%
                hoursLogged: projectHours[project.id] || 0,
                hoursEstimated: 40, // Default estimate
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 2 weeks from now
              }));
            
            setProjects(projectsWithProgress);
          }
        } else if (profile?.id) {
          // For authenticated users, fetch from database
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('id, name, end_date, budget_hours')
            .order('created_at', { ascending: false })
            .limit(3);
            
          if (projectsError) {
            console.error("Error fetching projects:", projectsError);
            throw projectsError;
          }
          
          if (projectsData && projectsData.length > 0) {
            // Fetch time entries to calculate progress
            const { data: entriesData, error: entriesError } = await supabase
              .from('time_entries')
              .select('project_id, hours')
              .in('project_id', projectsData.map(p => p.id));
              
            if (entriesError) {
              console.error("Error fetching time entries:", entriesError);
              throw entriesError;
            }
            
            // Calculate hours logged per project
            const projectHours: Record<string, number> = {};
            if (entriesData) {
              entriesData.forEach(entry => {
                if (!projectHours[entry.project_id]) {
                  projectHours[entry.project_id] = 0;
                }
                projectHours[entry.project_id] += Number(entry.hours);
              });
            }
            
            // Map projects with logged hours
            const projectsWithProgress = projectsData.map(project => ({
              id: project.id,
              name: project.name,
              progress: Math.min(Math.round((projectHours[project.id] || 0) / (project.budget_hours || 40) * 100), 100),
              hoursLogged: projectHours[project.id] || 0,
              hoursEstimated: project.budget_hours || 40,
              dueDate: project.end_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
            }));
            
            setProjects(projectsWithProgress);
          }
        }
      } catch (error) {
        console.error("Error in fetchProjects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [profile]);

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
