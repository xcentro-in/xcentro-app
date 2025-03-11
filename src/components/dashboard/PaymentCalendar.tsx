
import { Clock, Repeat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const upcomingPayments = [
  { vendor: "Office Rent", amount: 8500, date: "Aug 15", days: 3 },
  { vendor: "Cloud Infrastructure", amount: 2450, date: "Aug 18", days: 6 },
  { vendor: "Marketing Services", amount: 5999.99, date: "Aug 22", days: 10 },
];

const recurringPayments = [
  { vendor: "Software Subscriptions", amount: 1200, frequency: "Monthly" },
  { vendor: "Team Salaries", amount: 24500, frequency: "Monthly" },
  { vendor: "Internet Services", amount: 499.99, frequency: "Monthly" },
];

const PaymentCalendar = () => {
  return (
    <Card className="col-span-1 md:col-span-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <CardHeader>
        <Tabs defaultValue="upcoming">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Payment Calendar</CardTitle>
            <TabsList className="grid grid-cols-2 h-8">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="recurring">Recurring</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsContent value="upcoming" className="space-y-4 mt-0">
            {upcomingPayments.map((payment) => (
              <div 
                key={payment.vendor}
                className="flex items-center justify-between p-3 rounded-md border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium">{payment.vendor}</div>
                    <div className="text-xs text-muted-foreground">Due on {payment.date}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-medium">${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="text-xs text-muted-foreground">in {payment.days} days</div>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="recurring" className="space-y-4 mt-0">
            {recurringPayments.map((payment) => (
              <div 
                key={payment.vendor}
                className="flex items-center justify-between p-3 rounded-md border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-purple-500/10 flex items-center justify-center">
                    <Repeat className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="font-medium">{payment.vendor}</div>
                    <div className="text-xs text-muted-foreground">{payment.frequency} payment</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-medium">${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="text-xs text-muted-foreground">Automatic</div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentCalendar;
