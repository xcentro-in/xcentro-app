
import { BanknoteIcon, ChevronRight, Clock, CheckCircle2, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Transaction {
  id: number;
  vendor: string;
  amount: number;
  status: string;
  date: string;
  method: string;
}

const transactions: Transaction[] = [
  { id: 1, vendor: "Office Supplies Co.", amount: 2499.99, status: "completed", date: "Today", method: "credit" },
  { id: 2, vendor: "Cloud Services", amount: 899.00, status: "completed", date: "Yesterday", method: "bank" },
  { id: 3, vendor: "Marketing Agency", amount: 5999.99, status: "pending", date: "Aug 12", method: "credit" },
  { id: 4, vendor: "Rent Payment", amount: 8500.00, status: "upcoming", date: "Aug 15", method: "bank" },
];

const RecentTransactions = () => {
  return (
    <Card className="col-span-1 md:col-span-2 animate-fade-in" style={{ animationDelay: "150ms" }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activities</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 text-sm h-8 hover:bg-transparent hover:text-primary p-0">
          View All <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between transition-all hover:bg-muted/50 -mx-3 p-3 rounded-md cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  transaction.method === "credit" ? "bg-primary/10" : "bg-purple-500/10"
                )}>
                  {transaction.method === "credit" ? (
                    <CreditCard className={cn(
                      "h-5 w-5",
                      transaction.method === "credit" ? "text-primary" : "text-purple-500"
                    )} />
                  ) : (
                    <BanknoteIcon className="h-5 w-5 text-purple-500" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.vendor}</div>
                  <div className="text-xs text-muted-foreground">{transaction.date}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="font-medium">${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="flex items-center gap-1.5">
                  {transaction.status === "completed" && (
                    <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-600 text-[10px] px-1.5 py-0">
                      <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                      Completed
                    </Badge>
                  )}
                  {transaction.status === "pending" && (
                    <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-600 text-[10px] px-1.5 py-0">
                      <Clock className="h-2.5 w-2.5 mr-1" />
                      Pending
                    </Badge>
                  )}
                  {transaction.status === "upcoming" && (
                    <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-600 text-[10px] px-1.5 py-0">
                      <Clock className="h-2.5 w-2.5 mr-1" />
                      Upcoming
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
