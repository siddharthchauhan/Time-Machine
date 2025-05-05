
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklySummaryProps {
  summary: {
    totalHours: number;
    targetHours: number;
    completionPercentage: number;
    projectDistribution: Array<{
      name: string;
      hours: number;
      color?: string;
    }>;
    billableHours: number;
    billablePercentage: number;
  };
  isLoading: boolean;
}

const WeeklySummary = ({ summary, isLoading }: WeeklySummaryProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
          <CardDescription>
            Overview of your tracked time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">Loading summary data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
        <CardDescription>
          Overview of your tracked time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{summary.totalHours.toFixed(1)} hours</h3>
            <p className="text-sm text-muted-foreground">Total tracked time</p>
            <div className="h-2 w-full bg-muted rounded-full mt-2">
              <div 
                className="h-2 rounded-full bg-black" 
                style={{ width: `${summary.completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.completionPercentage.toFixed(1)}% of target ({summary.targetHours} hours)
            </p>
          </div>
          
          {summary.projectDistribution.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Time by Project</h4>
              <ul className="space-y-2">
                {summary.projectDistribution.slice(0, 5).map((project) => (
                  <li key={project.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: project.color || '#000000' }}
                      ></div>
                      <span className="text-sm">{project.name}</span>
                    </div>
                    <span className="text-sm font-medium">{project.hours.toFixed(1)} hours</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Billable vs Non-Billable</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm">Billable ({summary.billableHours.toFixed(1)} hours)</span>
              <span className="text-sm font-medium">{summary.billablePercentage.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full mt-1">
              <div 
                className="h-2 rounded-full bg-black" 
                style={{ width: `${summary.billablePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySummary;
