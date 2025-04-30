
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { TeamMember } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface TeamDashboardProps {
  members: TeamMember[];
}

const TeamDashboard = ({ members }: TeamDashboardProps) => {
  // Calculate statistics
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

  const projectStats = React.useMemo(() => {
    const projectCounts: Record<string, number> = {};
    members.forEach(member => {
      member.projects.forEach(project => {
        if (projectCounts[project]) {
          projectCounts[project]++;
        } else {
          projectCounts[project] = 1;
        }
      });
    });

    return Object.entries(projectCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value) // Sort by count descending
      .slice(0, 5); // Top 5 projects
  }, [members]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
            <CardDescription>Key team statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <div className="text-3xl font-bold">{members.length}</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <div className="text-3xl font-bold">{new Set(members.map(m => m.department)).size}</div>
                <div className="text-sm text-muted-foreground">Departments</div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <div className="text-3xl font-bold">
                  {members.filter(m => m.role === 'manager' || m.role === 'project_manager').length}
                </div>
                <div className="text-sm text-muted-foreground">Managers</div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <div className="text-3xl font-bold">
                  {new Set(members.flatMap(m => m.projects)).size}
                </div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Assignments</CardTitle>
            <CardDescription>Top projects by team member count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ChartContainer 
                config={{
                  bar1: { label: "Members", color: "#2563eb" }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={projectStats}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: "var(--muted)" }}
                    />
                    <Bar dataKey="value" name="bar1" fill="var(--color-bar1)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Directory</CardTitle>
            <CardDescription>Contact information for team leads</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.filter(m => m.role === 'manager' || m.role === 'admin' || m.role === 'project_manager')
                  .map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role === 'admin' ? 'Admin' : member.role === 'project_manager' ? 'Project Manager' : 'Manager'}</TableCell>
                      <TableCell>{member.department}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamDashboard;
