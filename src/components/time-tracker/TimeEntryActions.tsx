
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface TimeEntryActionsProps {
  isSubmitting: boolean;
  isTracking: boolean;
  handleSubmitForApproval: () => void;
  handleReset: () => void;
}

const TimeEntryActions = ({
  isSubmitting,
  isTracking,
  handleSubmitForApproval,
  handleReset
}: TimeEntryActionsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between w-full gap-3">
      <Button 
        variant="outline" 
        type="button" 
        onClick={handleReset}
        className="px-6"
      >
        Reset
      </Button>
      
      <div className="flex gap-3">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="px-6"
        >
          <Clock className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        <Button 
          type="button" 
          onClick={handleSubmitForApproval} 
          disabled={isSubmitting || isTracking} 
          variant="default"
          className="px-6"
        >
          <Clock className="mr-2 h-4 w-4" />
          Submit for Approval
        </Button>
      </div>
    </div>
  );
};

export default TimeEntryActions;
