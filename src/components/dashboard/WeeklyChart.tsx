
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useEffect } from "react";

const WeeklyChart = () => {
  const [data, setData] = useState<Array<{name: string, billable: number, nonBillable: number}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    // For now, we'll simulate loading and then set empty data
    const timer = setTimeout(() => {
      setData([]);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center">
        <p className="text-sm text-muted-foreground mb-4">No time data available for the current week</p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Hours</CardTitle>
        <CardDescription>
          Your time allocation for the current week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          ) : data.length > 0 ? (
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} hours`, undefined]}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
                <Bar dataKey="billable" stackId="a" fill="#000000" name="Billable Hours" />
                <Bar dataKey="nonBillable" stackId="a" fill="#888888" name="Non-Billable" />
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

export default WeeklyChart;
