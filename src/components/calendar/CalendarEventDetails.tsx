
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarDay, CalendarEvent } from "@/types/calendar";
import { X, Edit, FileEdit, AlertTriangle, Clock, MoreHorizontal, CalendarIcon, Plus, Eye, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/formatters";

interface CalendarEventDetailsProps {
  open: boolean;
  selectedDay: CalendarDay | null;
  onClose: () => void;
  onPayBill?: (billId: string) => void;
}

const CalendarEventDetails: React.FC<CalendarEventDetailsProps> = ({
  open,
  selectedDay,
  onClose,
  onPayBill
}) => {
  const navigate = useNavigate();
  
  if (!selectedDay) return null;
  
  const events = selectedDay.events;
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'success':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Draft</Badge>;
      case 'finalized':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Finalized</Badge>;
      case 'posted':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Posted</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending Payment</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetails = (event: CalendarEvent) => {
    // Navigate to bill details page
    navigate(`/bills/${event.id}`);
  };

  const handlePayBill = (event: CalendarEvent) => {
    if (onPayBill) {
      // Use parent callback to handle payment flow
      onPayBill(String(event.id));
    } else {
      // Fallback: Navigate to bill details page with payment tab
      navigate(`/bills/${event.id}?tab=payment`);
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent className="sm:max-w-md overflow-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span>{format(selectedDay.date, 'EEEE, MMMM d, yyyy')}</span>
          </SheetTitle>
          <SheetDescription>
            {events.length === 0
              ? "No bills due on this date"
              : `${events.length} bill${events.length > 1 ? 's' : ''} due`
            }
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <div className="mb-2">No bills due on this date</div>
            </div>
          ) : (
            events.map((event, index) => (
              <Card key={`${event.id}-${index}`} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        {event.description || 'Invoice payment'}
                      </CardDescription>
                    </div>
                    {getStatusBadge(event.status)}
                  </div>
                </CardHeader>

                <CardContent className="pb-0">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Amount Due</div>
                      <div className="font-semibold text-xl">
                        {formatCurrency(event.amount)}
                      </div>
                    </div>

                    {event.invoiceNumber && (
                      <div>
                        <div className="text-sm text-muted-foreground">Invoice Number</div>
                        <div className="font-medium">{event.invoiceNumber}</div>
                      </div>
                    )}
                  </div>

                  {event.status === 'overdue' && (
                    <div className="mt-3 rounded-md bg-red-50 p-3 flex gap-2 items-center text-red-700 text-sm">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <p>
                        This bill is overdue and needs immediate attention.
                      </p>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between gap-2 pt-3 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs flex-1"
                    onClick={() => handleViewDetails(event)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Bill
                  </Button>

                  {event.status !== 'paid' && event.status !== 'success' && (
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1 text-xs flex-1"
                      onClick={() => handlePayBill(event)}
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      Pay Now
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CalendarEventDetails;
