import { useState, useEffect } from "react";
import { 
  subWeeks, 
  startOfMonth,
  startOfQuarter
} from "date-fns";
import MainLayout from "@/components/layout/MainLayout";
import ReportFilters from "@/components/reports/ReportFilters";
import ReportsTabs from "@/components/reports/ReportsTabs";
import ReportsHeader from "@/components/reports/ReportsHeader";
import { useExportData } from "@/components/reports/ExportUtils";
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
    summary,
    timeEntries
  } = useReportsData(date, selectedProject);
  
  const { exportDataToCSV } = useExportData();
  
  const handleExportData = () => {
    exportDataToCSV(timeEntries, date);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <ReportsHeader 
          isLoading={isLoading} 
          timeEntries={timeEntries} 
          date={date}
          onExport={handleExportData}
        />
        
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
        
        <ReportsTabs
          weeklyChartData={weeklyChartData}
          projectChartData={projectChartData}
          summary={summary}
          isLoading={isLoading}
        />
      </div>
    </MainLayout>
  );
};

export default Reports;
