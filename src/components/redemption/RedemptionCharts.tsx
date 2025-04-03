
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PieChartDataPoint {
  name: string;
  value: number;
  fill: string;
}

interface LineChartDataPoint {
  name: string;
  points: number;
}

interface RedemptionChartsProps {
  pieData: PieChartDataPoint[];
  lineData: LineChartDataPoint[];
  colors: string[];
}

export const RedemptionPieChart = ({ pieData, colors }: { pieData: PieChartDataPoint[], colors: string[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Redemption by Category</CardTitle>
        <CardDescription>
          Distribution of points redeemed across different categories
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-4">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const RedemptionLineChart = ({ lineData }: { lineData: LineChartDataPoint[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Points Redeemed Over Time</CardTitle>
        <CardDescription>
          Monthly trends of point redemptions in the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={lineData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Legend />
            <Line
              type="monotone"
              dataKey="points"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
