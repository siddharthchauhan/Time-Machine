
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ProjectPieChartProps {
  data: Array<{ name: string; hours: number; color: string }>;
  isLoading: boolean;
}

const ProjectPieChart = ({ data, isLoading }: ProjectPieChartProps) => {
  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-sm text-muted-foreground mb-4">No project data available for the selected period</p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Distribution</CardTitle>
        <CardDescription>
          Hours spent on different projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#000000"
                  dataKey="hours"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} hours`, undefined]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            renderEmptyState()
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectPieChart;
