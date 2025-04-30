
import { TimeEntry } from "./types";
import TimeEntryCard from "./TimeEntryCard";

interface TimeEntriesTabContentProps {
  entries: TimeEntry[];
}

const TimeEntriesTabContent = ({ entries }: TimeEntriesTabContentProps) => {
  return (
    <div className="space-y-4 mt-4">
      {entries.length > 0 ? (
        entries.map((entry) => (
          <TimeEntryCard key={entry.id} entry={entry} />
        ))
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          No time entries found matching your filters.
        </div>
      )}
    </div>
  );
};

export default TimeEntriesTabContent;
