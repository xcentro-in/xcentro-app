
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

interface SalaryCommitmentCardProps {
  totalSalary: number;
  daysUntilPayday: number;
}

const SalaryCommitmentCard: React.FC<SalaryCommitmentCardProps> = ({ 
  totalSalary, 
  daysUntilPayday 
}) => {
  return (
    <Card className="col-span-1 md:col-span-2 border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Upcoming Salary Commitment</CardTitle>
        <CardDescription>Based on your previous payroll patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Your payroll this month</p>
            <p className="text-3xl font-bold tracking-tight text-blue-500">
              {formatCurrency(totalSalary)}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 rounded-md px-3 py-1.5 text-sm">
            Due in {daysUntilPayday} days
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalaryCommitmentCard;
