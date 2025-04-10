
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

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
        <div className="mt-2 text-sm">
          <p className="text-muted-foreground">Optimization tip:</p>
          <p>Switching ₹2 lakh more to credit card would earn you additional ₹10k in rewards annually.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodAnalysisCard;
