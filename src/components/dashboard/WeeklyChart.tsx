
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek, format, parseISO } from "date-fns";

const WeeklyChart = () => {
  const [data, setData] = useState<Array<{name: string, billable: number, nonBillable: number}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchWeeklyData = async () => {
      setIsLoading(true);
      
      try {
        // Get current week's date range
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday
        
        // Initialize days of the week
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const initialData = daysOfWeek.map(day => ({
          name: day,
          billable: 0,
          nonBillable: 0
        }));
        
        // For guest user, check localStorage
        if (profile?.id === 'guest') {
          const storedEntries = localStorage.getItem('guestTimeEntries');
          if (storedEntries) {
            const parsedEntries = JSON.parse(storedEntries);
            // Filter entries for current week and sum hours by day
            parsedEntries.forEach((entry: any) => {
              const entryDate = parseISO(entry.date);
              if (entryDate >= weekStart && entryDate <= weekEnd) {
                const dayIndex = entryDate.getDay() - 1; // 0 = Monday in our array
                const dayIndexAdjusted = dayIndex < 0 ? 6 : dayIndex; // Handle Sunday
                initialData[dayIndexAdjusted].billable += Number(entry.hours);
              }
            });
          }
        } else if (profile?.id) {
          // For authenticated users, fetch from database
          const { data: entriesData, error } = await supabase
            .from('time_entries')
            .select('date, hours')
            .eq('user_id', profile.id)
            .gte('date', format(weekStart, 'yyyy-MM-dd'))
            .lte('date', format(weekEnd, 'yyyy-MM-dd'));
            
          if (error) {
            console.error("Error fetching weekly data:", error);
            throw error;
          }
          
          if (entriesData && entriesData.length > 0) {
            // Process data for the chart
            entriesData.forEach(entry => {
              const entryDate = parseISO(entry.date);
              const dayIndex = entryDate.getDay() - 1; // 0 = Monday in our array
              const dayIndexAdjusted = dayIndex < 0 ? 6 : dayIndex; // Handle Sunday
              initialData[dayIndexAdjusted].billable += Number(entry.hours);
            });
          }
        }
        
        setData(initialData);
      } catch (error) {
        console.error("Error fetching weekly chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeeklyData();
  }, [profile]);

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
          ) : data.some(item => item.billable > 0 || item.nonBillable > 0) ? (
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
