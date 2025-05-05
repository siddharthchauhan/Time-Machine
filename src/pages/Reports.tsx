
import { useState, useEffect } from "react";
import { 
  addWeeks, 
  subWeeks, 
  startOfWeek, 
  startOfMonth,
  startOfQuarter,
  subMonths,
  subQuarters,
  format
} from "date-fns";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import ReportFilters from "@/components/reports/ReportFilters";
import WeeklyBarChart from "@/components/reports/charts/WeeklyBarChart";
import ProjectPieChart from "@/components/reports/charts/ProjectPieChart";
import WeeklySummary from "@/components/reports/WeeklySummary";
import { useReportsData } from "@/components/reports/hooks/useReportsData";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const { toast } = useToast();
  
  // Update the date when time period changes
  useEffect(() => {
    const today = new Date();
    
    switch (selectedPeriod) {
      case 'current':
        setDate(today);
        break;
      case 'previous':
        setDate(subWeeks(today, 1));
        break;
      case 'month':
        setDate(startOfMonth(today));
        break;
      case 'quarter':
        setDate(startOfQuarter(today));
        break;
      case 'custom':
        // Keep the current date
        break;
      default:
        setDate(today);
    }
  }, [selectedPeriod]);
  
  // Fetch data based on the selected filters
  const {
    isLoading,
    error,
    projects,
    weeklyChartData,
    projectChartData,
    summary,
    timeEntries
  } = useReportsData(date, selectedProject);
  
  const handleExportData = () => {
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
    } catch (err) {
      console.error("Export error:", err);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground mt-1">
              Analyze time data and generate reports for your projects.
            </p>
          </div>
          <Button onClick={handleExportData} disabled={isLoading || timeEntries.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
        
        <ReportFilters
          date={date}
          setDate={setDate}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          projects={projects}
        />
        
        {error && (
          <div className="rounded-md bg-destructive/15 p-4 text-destructive">
            <p>Error loading report data: {error}</p>
          </div>
        )}
        
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <WeeklyBarChart 
              data={weeklyChartData} 
              isLoading={isLoading} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProjectPieChart 
                data={projectChartData} 
                isLoading={isLoading} 
              />
              
              <WeeklySummary 
                summary={summary} 
                isLoading={isLoading} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="projects">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Project Time Analysis</h3>
                {isLoading ? (
                  <p className="text-muted-foreground text-center py-10">Loading project data...</p>
                ) : projectChartData.length > 0 ? (
                  <p className="text-muted-foreground">
                    Detailed project time analysis will be displayed here
                  </p>
                ) : (
                  <p className="text-muted-foreground text-center py-10">
                    No project data available for the selected period
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="team">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Team Time Analysis</h3>
                <p className="text-muted-foreground text-center py-10">
                  Team time analysis will be displayed here
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
