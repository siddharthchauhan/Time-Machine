
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
          <div className="flex justify-between items-center w-full">
            <div>
              <AlertTitle>Profile Error</AlertTitle>
              <AlertDescription>
                {loadError}
              </AlertDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onProfileRefresh}
              className="ml-2 whitespace-nowrap"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh Profile
            </Button>
          </div>
        </Alert>
      )}
      
      {databaseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div className="flex justify-between items-center w-full">
            <div>
              <AlertTitle>Database Error</AlertTitle>
              <AlertDescription>
                {databaseError}
              </AlertDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetryProjects}
              className="ml-2 whitespace-nowrap"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
            </Button>
          </div>
        </Alert>
      )}
    </>
  );
};

export default TimeTrackerAlerts;
