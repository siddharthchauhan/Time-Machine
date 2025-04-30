
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TeamMember } from '../types';

interface ProjectAssignmentsChartProps {
  members: TeamMember[];
}

const ProjectAssignmentsChart = ({ members }: ProjectAssignmentsChartProps) => {
  // Calculate project statistics
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
  );
};

export default ProjectAssignmentsChart;
