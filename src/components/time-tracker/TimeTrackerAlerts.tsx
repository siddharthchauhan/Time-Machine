
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Database, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeTrackerAlertsProps {
  loadError: any;
  databaseError: string | null;
  onProfileRefresh: () => Promise<void>;
  onRetryProjects: () => Promise<void>;
}

const TimeTrackerAlerts = ({
  loadError,
  databaseError,
  onProfileRefresh,
  onRetryProjects
}: TimeTrackerAlertsProps) => {
  return (
    <div className="space-y-4">
      {loadError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>There was a problem loading your user profile.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-fit" 
              onClick={onProfileRefresh}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh Profile
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {databaseError && (
        <Alert variant="destructive">
          <Database className="h-4 w-4" />
          <AlertTitle>Database Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{databaseError}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-fit" 
              onClick={onRetryProjects}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TimeTrackerAlerts;
