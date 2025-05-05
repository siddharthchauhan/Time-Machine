
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ReportsHeaderProps {
  isLoading: boolean;
  timeEntries: any[];
  date: Date;
  onExport: () => void;
}

const ReportsHeader = ({ isLoading, timeEntries, date, onExport }: ReportsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1">
          Analyze time data and generate reports for your projects.
        </p>
      </div>
      <Button onClick={onExport} disabled={isLoading || timeEntries.length === 0}>
        <Download className="mr-2 h-4 w-4" />
        Export Data
      </Button>
    </div>
  );
};

export default ReportsHeader;
