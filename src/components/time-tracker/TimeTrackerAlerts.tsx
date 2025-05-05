
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Database, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileErrorAlert from "./ProfileErrorAlert";

interface TimeTrackerAlertsProps {
  loadError: any;
  databaseError: string | null;
  onProfileRefresh: () => Promise<void>;
  onRetryProjects: () => Promise<void>;
  isRefreshing?: boolean;
}

const TimeTrackerAlerts = ({
  loadError,
  databaseError,
  onProfileRefresh,
  onRetryProjects,
  isRefreshing = false
}: TimeTrackerAlertsProps) => {
  return (
    <div className="space-y-4">
      {loadError && (
        <ProfileErrorAlert 
          errorMessage="There was a problem loading your user profile."
          onRefresh={onProfileRefresh}
          isRefreshing={isRefreshing}
        />
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
              disabled={isRefreshing}
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Retrying...' : 'Retry Connection'}
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TimeTrackerAlerts;
