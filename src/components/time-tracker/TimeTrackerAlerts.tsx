
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface TimeTrackerAlertsProps {
  loadError: string | null;
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
    <>
      {loadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>Profile error: {loadError}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onProfileRefresh}
              className="ml-2"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh Profile
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {databaseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>Database error: {databaseError}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetryProjects}
              className="ml-2"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default TimeTrackerAlerts;
