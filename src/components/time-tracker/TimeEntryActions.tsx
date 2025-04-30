
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
    <>
      <div>
        <Button variant="outline" type="button" onClick={handleReset}>
          Reset
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-40"
        >
          <Clock className="mr-2 h-4 w-4 shrink-0" />
          Save as Draft
        </Button>
        <Button 
          type="button" 
          onClick={handleSubmitForApproval} 
          disabled={isSubmitting || isTracking} 
          variant="default"
          className="w-40"
        >
          <Clock className="mr-2 h-4 w-4 shrink-0" />
          Submit for Approval
        </Button>
      </div>
    </>
  );
};

export default TimeEntryActions;
