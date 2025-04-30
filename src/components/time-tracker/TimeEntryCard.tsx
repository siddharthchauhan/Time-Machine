
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash } from "lucide-react";
import { TimeEntryStatus, TimeEntry } from "./types";
import { getStatusBadge } from "./utils";

interface TimeEntryCardProps {
  entry: TimeEntry;
}

const TimeEntryCard = ({ entry }: TimeEntryCardProps) => {
  return (
    <div className="flex items-center p-3 rounded-lg border bg-card">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">{entry.project}</h4>
          {getStatusBadge(entry.status)}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
          <p className="text-xs text-muted-foreground">
            {entry.task}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(entry.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-xs font-medium">{entry.hours} hours</p>
        </div>
        {entry.description && (
          <p className="text-xs mt-2 line-clamp-2">{entry.description}</p>
        )}
        {entry.status === 'rejected' && entry.rejection_reason && (
          <div className="mt-2 p-2 bg-destructive/10 rounded-sm text-xs">
            <span className="font-medium">Rejection feedback:</span> {entry.rejection_reason}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost">
          <Eye className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" disabled={entry.status === 'approved'}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="text-destructive" disabled={entry.status === 'approved'}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TimeEntryCard;
