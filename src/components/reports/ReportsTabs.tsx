
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import WeeklyBarChart from "@/components/reports/charts/WeeklyBarChart";
import ProjectPieChart from "@/components/reports/charts/ProjectPieChart";
import WeeklySummary from "@/components/reports/WeeklySummary";

interface ReportsTabsProps {
  weeklyChartData: any[];
  projectChartData: any[];
  summary: any;
  isLoading: boolean;
}

const ReportsTabs = ({ 
  weeklyChartData, 
  projectChartData, 
  summary, 
  isLoading 
}: ReportsTabsProps) => {
  return (
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
  );
};

export default ReportsTabs;
