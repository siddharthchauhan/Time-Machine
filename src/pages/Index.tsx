
import MainLayout from "@/components/layout/MainLayout";
import TimeStats from "@/components/dashboard/TimeStats";
import RecentTimeEntries from "@/components/dashboard/RecentTimeEntries";
import ProjectProgress from "@/components/dashboard/ProjectProgress";
import UpcomingTasks from "@/components/dashboard/UpcomingTasks";
import WeeklyChart from "@/components/dashboard/WeeklyChart";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your tracking activities.
          </p>
        </div>
        
        <TimeStats />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-4 md:space-y-6">
            <RecentTimeEntries />
            <UpcomingTasks />
          </div>
          <div className="space-y-4 md:space-y-6">
            <WeeklyChart />
            <ProjectProgress />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
