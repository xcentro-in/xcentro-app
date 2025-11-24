
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface BillDetailsProps {
  billId: string;
  billDate: string;
  billAmount: number;
}

export const BillDetails = ({ billId, billDate, billAmount }: BillDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bill Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Bill ID</div>
            <div className="font-medium">{billId}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Bill Date</div>
            <div className="font-medium">{format(new Date(billDate), "MMMM d, yyyy")}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Bill Amount</div>
            <div className="font-medium">${billAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
        <Button variant="outline" className="mt-4 w-full gap-1">
          <FileText className="h-4 w-4" />
          View Original Bill
        </Button>
      </CardContent>
    </Card>
  );
};
