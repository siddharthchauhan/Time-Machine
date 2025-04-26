
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  {
    name: 'Mon',
    billable: 6.5,
    nonBillable: 1.0,
  },
  {
    name: 'Tue',
    billable: 7.2,
    nonBillable: 0.5,
  },
  {
    name: 'Wed',
    billable: 4.3,
    nonBillable: 1.5,
  },
  {
    name: 'Thu',
    billable: 5.0,
    nonBillable: 2.2,
  },
  {
    name: 'Fri',
    billable: 7.8,
    nonBillable: 0.2,
  },
  {
    name: 'Sat',
    billable: 1.5,
    nonBillable: 0,
  },
  {
    name: 'Sun',
    billable: 0,
    nonBillable: 0.5,
  },
];

const WeeklyChart = () => {
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
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyChart;
