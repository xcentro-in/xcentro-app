
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TransferLimitCardProps {
  availablePoints: number;
  children: ReactNode;
}

const TransferLimitCard = ({ availablePoints, children }: TransferLimitCardProps) => {
  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Transfer Details</CardTitle>
        <CardDescription>
          You have {availablePoints.toLocaleString()} points available to transfer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default TransferLimitCard;
