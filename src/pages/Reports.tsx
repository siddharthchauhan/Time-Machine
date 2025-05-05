import { useState, useEffect } from "react";
import { 
  addWeeks, 
  subWeeks, 
  startOfWeek, 
  startOfMonth,
  startOfQuarter,
  subMonths,
  subQuarters
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

const Reports = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  
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
    summary
  } = useReportsData(date, selectedProject);
  
  const handleExportData = () => {
    // This would be implemented to export data as CSV, PDF, etc.
    console.log("Export data functionality to be implemented");
    // For now just show what data would be exported
    console.log("Data to export:", { weeklyChartData, projectChartData, summary });
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
          <Button onClick={handleExportData}>
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
