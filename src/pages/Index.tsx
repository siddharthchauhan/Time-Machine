
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import TimeStats from "@/components/dashboard/TimeStats";
import RecentTimeEntries from "@/components/dashboard/RecentTimeEntries";
import ProjectProgress from "@/components/dashboard/ProjectProgress";
import UpcomingTasks from "@/components/dashboard/UpcomingTasks";
import WeeklyChart from "@/components/dashboard/WeeklyChart";
import FocusTimer from "@/components/dashboard/FocusTimer";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-4 md:space-y-8">
          <div>
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4 md:space-y-6">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-4 md:space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

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
            <FocusTimer />
            <RecentTimeEntries />
          </div>
          <div className="space-y-4 md:space-y-6">
            <WeeklyChart />
            <ProjectProgress />
            <UpcomingTasks />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
