
import { useState } from "react";
import { CreditCardBill } from "@/types/credit-card-bill";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, CalendarDays } from "lucide-react";
import { format, parseISO, isBefore } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BillTableProps {
  bills: CreditCardBill[];
  onPayClick: (bill: CreditCardBill) => void;
}

export default function BillTable({ bills, onPayClick }: BillTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CreditCardBill | null;
    direction: 'ascending' | 'descending';
  }>({
    key: null,
    direction: 'ascending'
  });

  const sortedBills = [...bills].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    if (sortConfig.key === 'dueDate') {
      const dateA = new Date(a[sortConfig.key]);
      const dateB = new Date(b[sortConfig.key]);
      return sortConfig.direction === 'ascending' 
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof CreditCardBill) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (bill: CreditCardBill) => {
    const dueDate = parseISO(bill.dueDate);
    const isPastDue = isBefore(dueDate, new Date());
    
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
            <CalendarDays className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/50">
            <th 
              className="px-4 py-3 text-left text-sm cursor-pointer hover:bg-muted"
              onClick={() => requestSort('cardIssuer')}
            >
              Card
              {sortConfig.key === 'cardIssuer' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm cursor-pointer hover:bg-muted"
              onClick={() => requestSort('dueDate')}
            >
              Due Date
              {sortConfig.key === 'dueDate' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm cursor-pointer hover:bg-muted"
              onClick={() => requestSort('totalDueAmount')}
            >
              Total Due
              {sortConfig.key === 'totalDueAmount' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm cursor-pointer hover:bg-muted"
              onClick={() => requestSort('minimumDueAmount')}
            >
              Min. Due
              {sortConfig.key === 'minimumDueAmount' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm cursor-pointer hover:bg-muted"
              onClick={() => requestSort('status')}
            >
              Status
              {sortConfig.key === 'status' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </th>
            <th className="px-4 py-3 text-right text-sm">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedBills.map((bill) => (
            <tr 
              key={bill.id} 
              className={cn(
                "border-b hover:bg-muted/50",
                bill.status === "overdue" && "bg-red-50/50",
                bill.status === "paid" && "bg-green-50/30"
              )}
            >
              <td className="px-4 py-3">
                <div className="font-medium">{bill.cardIssuer}</div>
                <div className="text-sm text-muted-foreground">**** {bill.lastFourDigits}</div>
              </td>
              <td className="px-4 py-3">
                <div className={cn(
                  "font-medium",
                  bill.status === "overdue" && "text-red-600"
                )}>
                  {format(parseISO(bill.dueDate), "dd MMM yyyy")}
                </div>
              </td>
              <td className="px-4 py-3 font-medium">₹{bill.totalDueAmount.toLocaleString()}</td>
              <td className="px-4 py-3">₹{bill.minimumDueAmount.toLocaleString()}</td>
              <td className="px-4 py-3">{getStatusBadge(bill)}</td>
              <td className="px-4 py-3 text-right">
                {bill.status !== "paid" ? (
                  <Button 
                    size="sm" 
                    variant={bill.status === "overdue" ? "destructive" : "default"}
                    onClick={() => onPayClick(bill)}
                  >
                    Pay Now
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled>Paid</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
