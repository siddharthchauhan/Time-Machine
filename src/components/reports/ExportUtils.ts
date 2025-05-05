
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export const useExportData = () => {
  const { toast } = useToast();

  const exportDataToCSV = (timeEntries: any[], date: Date) => {
    try {
      // Create CSV content for time entries
      const headers = [
        "Date",
        "Project",
        "Hours",
        "Description"
      ].join(",");
      
      const rows = timeEntries.map(entry => [
        entry.date,
        entry.project_name || 'Unknown Project',
        entry.hours,
        `"${(entry.description || '').replace(/"/g, '""')}"` // Escape quotes in CSV
      ].join(","));
      
      const csvContent = [headers, ...rows].join("\n");
      
      // Create a Blob with the CSV data
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger a click
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `time-report-${format(date, 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Your time report has been exported as CSV.",
      });
    } catch (err: any) {
      console.error("Export error:", err);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { exportDataToCSV };
};
