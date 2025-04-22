
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart4, Clock, Target, TrendingUp } from "lucide-react";

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
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <TimeStatCard
        title="Hours This Week"
        value="32.5"
        description="Out of 40 hour goal"
        icon={<Clock className="h-4 w-4" />}
        trend="8% increase from last week"
        trendUp={true}
      />
      <TimeStatCard
        title="Billable Hours"
        value="28.2"
        description="87% of total hours"
        icon={<Target className="h-4 w-4" />}
        trend="5% increase from last week"
        trendUp={true}
      />
      <TimeStatCard
        title="Pending Approvals"
        value="3"
        description="Waiting for manager review"
        icon={<Clock className="h-4 w-4" />}
      />
      <TimeStatCard
        title="Project Progress"
        value="68%"
        description="Across all active projects"
        icon={<BarChart4 className="h-4 w-4" />}
        trend="15% increase from last month"
        trendUp={true}
      />
    </div>
  );
};

export default TimeStats;
