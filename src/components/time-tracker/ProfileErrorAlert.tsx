
import { RefreshCcw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ProfileErrorAlertProps {
  errorMessage: string;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

const ProfileErrorAlert = ({
  errorMessage,
  onRefresh,
  isRefreshing
}: ProfileErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="bg-amber-50 border-amber-200">
      <AlertTitle className="text-amber-600">Unable to load profile</AlertTitle>
      <div className="flex items-center justify-between">
        <AlertDescription className="text-amber-600">
          {errorMessage}
        </AlertDescription>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRefresh();
          }}
          className="ml-2 h-7"
          disabled={isRefreshing}
        >
          <RefreshCcw className={`h-3.5 w-3.5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
    </Alert>
  );
};

export default ProfileErrorAlert;
