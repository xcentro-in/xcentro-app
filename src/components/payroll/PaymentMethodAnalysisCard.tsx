
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface PaymentMethodData {
  name: string;
  value: number;
}

interface PaymentMethodAnalysisCardProps {
  paymentMethodData: PaymentMethodData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PaymentMethodAnalysisCard: React.FC<PaymentMethodAnalysisCardProps> = ({
  paymentMethodData
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Payment Method Analysis</CardTitle>
        <CardDescription>Current distribution of salary payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-start gap-2">
          <Badge variant="luxury" className="flex items-center gap-2 py-1.5 px-3 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="text-sm font-medium">
              Switching ₹2 lakh more to credit card would earn you additional ₹10k in rewards annually!
            </span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodAnalysisCard;
