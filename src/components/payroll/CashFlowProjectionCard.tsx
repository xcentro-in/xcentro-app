
import React from "react";
import { AlertTriangle, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency } from "@/utils/formatters";

interface CashFlowProjectionCardProps {
  incomingPayments: number;
  totalSalary: number;
  shortfall: number;
}

const CashFlowProjectionCard: React.FC<CashFlowProjectionCardProps> = ({ 
  incomingPayments,
  totalSalary,
  shortfall
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Cash Flow vs Salary</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">This shows projected cash inflow before your payroll date versus your total salary obligation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-muted-foreground">Incoming before payroll</span>
              <span>{formatCurrency(incomingPayments)}</span>
            </div>
            <Progress value={(incomingPayments / totalSalary) * 100} className="h-2" />
          </div>
          <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            <span>You're {formatCurrency(shortfall)} short for payroll</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowProjectionCard;
