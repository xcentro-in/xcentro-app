import { format, parseISO, isBefore, differenceInDays } from "date-fns";
import { CreditCardBill } from "@/types/credit-card-bill";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BillCardProps {
  bill: CreditCardBill;
  onPayClick: (bill: CreditCardBill) => void;
}

export default function BillCard({ bill, onPayClick }: BillCardProps) {
  const dueDate = parseISO(bill.dueDate);
  const today = new Date();
  const isPastDue = isBefore(dueDate, today);
  const daysUntilDue = differenceInDays(dueDate, today);

  const getStatusBadge = () => {
    switch (bill.status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Check className="h-3 w-3 mr-1" /> Paid
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" /> Overdue
          </Badge>
        );
      case "pending":
        return isPastDue ? (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <AlertCircle className="h-3 w-3 mr-1" /> Due Today
          </Badge>
        ) : (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Calendar className="h-3 w-3 mr-1" /> Due in {daysUntilDue} days
          </Badge>
        );
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      bill.status === "overdue" && "border-red-300",
      bill.status === "paid" && "border-green-300",
      bill.status === "pending" && daysUntilDue <= 3 && daysUntilDue >= 0 && "border-amber-300"
    )}>
      <CardContent className="p-0">
        <div className={cn(
          "p-3 flex items-center border-b",
          bill.status === "overdue" && "bg-red-50",
          bill.status === "paid" && "bg-green-50",
          bill.status === "pending" && daysUntilDue <= 3 && daysUntilDue >= 0 && "bg-amber-50"
        )}>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium">{bill.cardIssuer}</div>
            <div className="text-sm text-muted-foreground">**** {bill.lastFourDigits}</div>
          </div>
          <div>
            {getStatusBadge()}
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Due</div>
              <div className="text-lg font-bold">{formatCurrency(bill.totalDueAmount)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Min. Due</div>
              <div className="text-lg font-bold">{formatCurrency(bill.minimumDueAmount)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Due Date</div>
              <div className={cn(
                "font-medium",
                bill.status === "overdue" && "text-red-600",
                bill.status === "pending" && daysUntilDue <= 3 && "text-amber-600"
              )}>
                {format(parseISO(bill.dueDate), "dd MMM yyyy")}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Bill Period</div>
              <div className="text-sm">{bill.billPeriod}</div>
            </div>
          </div>

          {bill.status !== "paid" && (
            <Button 
              className="w-full" 
              onClick={() => onPayClick(bill)}
              variant={bill.status === "overdue" ? "destructive" : "default"}
            >
              Pay Now
            </Button>
          )}

          {bill.status === "paid" && (
            <Button variant="outline" className="w-full" disabled>
              <Check className="mr-2 h-4 w-4" />
              Already Paid
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}