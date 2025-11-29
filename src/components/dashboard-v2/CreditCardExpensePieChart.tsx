import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/utils/formatters";

// Soothing, distinct color palette for pie chart
const COLORS = [
  "#6366f1", // Indigo - calm and professional
  "#8b5cf6", // Purple - creative and distinct
  "#06b6d4", // Cyan - fresh and modern
  "#10b981", // Emerald - positive and balanced
  "#f59e0b", // Amber - warm and attention-grabbing
  "#ec4899", // Pink - vibrant yet soft
  "#14b8a6", // Teal - sophisticated
  "#f97316", // Orange - energetic
  "#a855f7", // Violet - elegant
];

interface CreditCardExpensePieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const CreditCardExpensePieChart = ({ data }: CreditCardExpensePieChartProps) => {
  const creditCardData = data;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-sm text-primary">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Expense by Credit Card</CardTitle>
        <CardDescription>Spending breakdown by card (This Month)</CardDescription>
      </CardHeader>
      <CardContent>
        {creditCardData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            No credit card expenses this month
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={creditCardData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {creditCardData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditCardExpensePieChart;
