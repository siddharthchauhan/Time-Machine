
import { TimeEntry } from "./types";
import TimeEntryCard from "./TimeEntryCard";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeEntriesTabContentProps {
  entries: TimeEntry[];
  isLoading?: boolean;
  onDeleteEntry?: (id: string) => void;
  onEditEntry?: (entry: TimeEntry) => void;
}

const TimeEntriesTabContent = ({ 
  entries, 
  isLoading = false,
  onDeleteEntry,
  onEditEntry
}: TimeEntriesTabContentProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-3 rounded-lg border">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-1/4" />
              </div>
              <div className="flex flex-col space-y-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-3 w-3/4 mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4 mt-4">
      {entries.length > 0 ? (
        entries.map((entry) => (
          <TimeEntryCard 
            key={entry.id} 
            entry={entry} 
            onDelete={onDeleteEntry}
            onEdit={onEditEntry}
          />
        ))
      ) : (
        <div className="text-center py-10 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground mb-2">No time entries found</p>
          <p className="text-xs text-muted-foreground">
            Time entries you submit will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeEntriesTabContent;
