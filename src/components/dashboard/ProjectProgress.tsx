
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
  id: string;
  name: string;
  progress: number;
  hoursLogged: number;
  hoursEstimated: number;
  dueDate: string;
}

const ProjectProgress = () => {
  // Empty state UI for when there are no projects
  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">No active projects to show</p>
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
        <div className="space-y-6">
          {renderEmptyState()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectProgress;
