
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TeamMember } from '../../types';

interface TeamRolesChartProps {
  members: TeamMember[];
}

const TeamRolesChart = ({ members }: TeamRolesChartProps) => {
  // Calculate role statistics
  const roleStats = React.useMemo(() => {
    const roleCounts: Record<string, number> = {};
    members.forEach(member => {
      if (roleCounts[member.role]) {
        roleCounts[member.role]++;
      } else {
        roleCounts[member.role] = 1;
      }
    });

    return Object.entries(roleCounts).map(([name, value]) => ({ 
      name: name === 'admin' ? 'Admin' : 
           name === 'manager' ? 'Manager' :
           name === 'project_manager' ? 'Project Manager' : 'Team Member', 
      value, 
      color: name === 'admin' ? '#2563eb' : 
             name === 'manager' ? '#10b981' :
             name === 'project_manager' ? '#8b5cf6' : '#6b7280'
    }));
  }, [members]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Roles</CardTitle>
        <CardDescription>Distribution by role</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={roleStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#000000"
                dataKey="value"
                nameKey="name"
              >
                {roleStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} members`, undefined]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamRolesChart;
