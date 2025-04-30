
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TeamMember } from '../../types';

interface DepartmentDistributionChartProps {
  members: TeamMember[];
}

const DepartmentDistributionChart = ({ members }: DepartmentDistributionChartProps) => {
  // Calculate department statistics
  const departmentStats = React.useMemo(() => {
    const deptCounts: Record<string, number> = {};
    members.forEach(member => {
      if (deptCounts[member.department]) {
        deptCounts[member.department]++;
      } else {
        deptCounts[member.department] = 1;
      }
    });

    return Object.entries(deptCounts).map(([name, value]) => ({ 
      name, 
      value, 
      color: `hsl(${Math.random() * 360}, 70%, 50%)` 
    }));
  }, [members]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Distribution</CardTitle>
        <CardDescription>Members by department</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departmentStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#000000"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {departmentStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} members`, undefined]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentDistributionChart;
