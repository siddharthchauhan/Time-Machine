
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyBarChartProps {
  data: Array<{ name: string; hours: number }>;
  isLoading: boolean;
}

const WeeklyBarChart = ({ data, isLoading }: WeeklyBarChartProps) => {
  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center">
        <p className="text-sm text-muted-foreground mb-4">No time data available for the selected period</p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Time Distribution</CardTitle>
        <CardDescription>
          Your time allocation across the week
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="h-80">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          ) : data.some(item => item.hours > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#888888" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} hours`, undefined]}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="hours" fill="#000000" name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            renderEmptyState()
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyBarChart;
