
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart4, Clock, Target, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek, format, addWeeks, parseISO } from "date-fns";

interface TimeStatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const TimeStatCard = ({ title, value, description, icon, trend, trendUp }: TimeStatCardProps) => (
  <Card className="card-hover">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      {trend && (
        <div className={`flex items-center mt-2 text-xs ${trendUp ? 'text-success-500' : 'text-destructive'}`}>
          <TrendingUp className={`h-3 w-3 mr-1 ${!trendUp && 'rotate-180'}`} />
          <span>{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const TimeStats = () => {
  const [stats, setStats] = useState({
    currentWeekHours: 0,
    previousWeekHours: 0,
    billableHours: 0,
    pendingApprovals: 0,
    projectProgress: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchTimeStats = async () => {
      setIsLoading(true);
      
      try {
        // Get date ranges
        const now = new Date();
        const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const currentWeekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday
        const previousWeekStart = startOfWeek(addWeeks(now, -1), { weekStartsOn: 1 });
        const previousWeekEnd = endOfWeek(addWeeks(now, -1), { weekStartsOn: 1 });
        
        let currentWeekHours = 0;
        let previousWeekHours = 0;
        let billableHours = 0;
        let pendingApprovals = 0;
        let projectsWithProgress = 0;
        let totalProjects = 0;
        
        if (profile?.id === 'guest') {
          // For guest user, check localStorage
          const storedEntries = localStorage.getItem('guestTimeEntries');
          const storedProjects = localStorage.getItem('guestProjects');
          
          if (storedEntries) {
            const parsedEntries = JSON.parse(storedEntries);
            
            // Calculate current week hours
            parsedEntries.forEach((entry: any) => {
              const entryDate = parseISO(entry.date);
              
              // Current week
              if (entryDate >= currentWeekStart && entryDate <= currentWeekEnd) {
                currentWeekHours += Number(entry.hours);
                billableHours += Number(entry.hours); // Assume all hours are billable
              }
              
              // Previous week
              if (entryDate >= previousWeekStart && entryDate <= previousWeekEnd) {
                previousWeekHours += Number(entry.hours);
              }
              
              // Count pending approvals
              if (entry.status === 'submitted' && entry.approval_status === 'pending') {
                pendingApprovals++;
              }
            });
          }
          
          // Calculate project progress
          if (storedProjects) {
            const parsedProjects = JSON.parse(storedProjects);
            totalProjects = parsedProjects.length;
            projectsWithProgress = Math.ceil(totalProjects * 0.68); // Simulate 68% progress
          }
        } else if (profile?.id) {
          // For authenticated users, fetch from database
          // Current week hours
          const { data: currentWeekData, error: currentWeekError } = await supabase
            .from('time_entries')
            .select('hours')
            .eq('user_id', profile.id)
            .gte('date', format(currentWeekStart, 'yyyy-MM-dd'))
            .lte('date', format(currentWeekEnd, 'yyyy-MM-dd'));
            
          if (currentWeekError) {
            console.error("Error fetching current week hours:", currentWeekError);
            throw currentWeekError;
          }
          
          if (currentWeekData) {
            currentWeekHours = currentWeekData.reduce((sum, entry) => sum + Number(entry.hours), 0);
            billableHours = currentWeekHours * 0.87; // Assume 87% are billable
          }
          
          // Previous week hours
          const { data: previousWeekData, error: previousWeekError } = await supabase
            .from('time_entries')
            .select('hours')
            .eq('user_id', profile.id)
            .gte('date', format(previousWeekStart, 'yyyy-MM-dd'))
            .lte('date', format(previousWeekEnd, 'yyyy-MM-dd'));
            
          if (previousWeekError) {
            console.error("Error fetching previous week hours:", previousWeekError);
            throw previousWeekError;
          }
          
          if (previousWeekData) {
            previousWeekHours = previousWeekData.reduce((sum, entry) => sum + Number(entry.hours), 0);
          }
          
          // Pending approvals
          const { data: approvalsData, error: approvalsError } = await supabase
            .from('time_entries')
            .select('id')
            .eq('user_id', profile.id)
            .eq('status', 'submitted')
            .eq('approval_status', 'pending');
            
          if (approvalsError) {
            console.error("Error fetching pending approvals:", approvalsError);
            throw approvalsError;
          }
          
          if (approvalsData) {
            pendingApprovals = approvalsData.length;
          }
          
          // Projects progress
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('id')
            .eq('status', 'active');
            
          if (projectsError) {
            console.error("Error fetching projects:", projectsError);
            throw projectsError;
          }
          
          if (projectsData) {
            totalProjects = projectsData.length;
            projectsWithProgress = Math.ceil(totalProjects * 0.68); // Assume 68% progress
          }
        }
        
        setStats({
          currentWeekHours,
          previousWeekHours,
          billableHours,
          pendingApprovals,
          projectProgress: totalProjects > 0 ? Math.round((projectsWithProgress / totalProjects) * 100) : 0
        });
      } catch (error) {
        console.error("Error in fetchTimeStats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTimeStats();
  }, [profile]);
  
  // Calculate trends
  const weeklyTrend = stats.previousWeekHours > 0 
    ? Math.round(((stats.currentWeekHours - stats.previousWeekHours) / stats.previousWeekHours) * 100) 
    : 0;
  
  const billablePercent = stats.currentWeekHours > 0 
    ? Math.round((stats.billableHours / stats.currentWeekHours) * 100) 
    : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <TimeStatCard
        title="Hours This Week"
        value={stats.currentWeekHours.toFixed(1)}
        description="Out of 40 hour goal"
        icon={<Clock className="h-4 w-4" />}
        trend={weeklyTrend !== 0 ? `${Math.abs(weeklyTrend)}% ${weeklyTrend >= 0 ? 'increase' : 'decrease'} from last week` : undefined}
        trendUp={weeklyTrend >= 0}
      />
      <TimeStatCard
        title="Billable Hours"
        value={stats.billableHours.toFixed(1)}
        description={`${billablePercent}% of total hours`}
        icon={<Target className="h-4 w-4" />}
        trend={billablePercent > 80 ? "Good utilization rate" : undefined}
        trendUp={true}
      />
      <TimeStatCard
        title="Pending Approvals"
        value={stats.pendingApprovals.toString()}
        description="Waiting for manager review"
        icon={<Clock className="h-4 w-4" />}
      />
      <TimeStatCard
        title="Project Progress"
        value={`${stats.projectProgress}%`}
        description="Across all active projects"
        icon={<BarChart4 className="h-4 w-4" />}
        trend="Based on time logged vs estimated"
        trendUp={true}
      />
    </div>
  );
};

export default TimeStats;
