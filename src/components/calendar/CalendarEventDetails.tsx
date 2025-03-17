
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarDay, CalendarEvent } from "@/types/calendar";
import { X, Edit, FileEdit, AlertTriangle, Clock, MoreHorizontal, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";
import { useNavigate } from "react-router-dom";

interface CalendarEventDetailsProps {
  open: boolean;
  selectedDay: CalendarDay | null;
  filterType: string;
  onClose: () => void;
}

const CalendarEventDetails: React.FC<CalendarEventDetailsProps> = ({
  open,
  selectedDay,
  filterType,
  onClose
}) => {
  const navigate = useNavigate();
  
  if (!selectedDay) return null;
  
  const filteredEvents = selectedDay.events.filter(event => {
    if (filterType === 'all') return true;
    if (filterType === 'recurring') return event.type === 'recurring';
    if (filterType === 'scheduled') return event.status === 'upcoming';
    if (filterType === 'completed') return event.status === 'completed';
    if (filterType === 'pending') return event.status === 'pending' || event.status === 'pending_approval';
    return true;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'pending_approval':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Needs Approval</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleViewDetails = (event: CalendarEvent) => {
    navigate(`/payments/${event.id}`);
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
            {filteredEvents.length === 0 
              ? "No payments scheduled for this day" 
              : `${filteredEvents.length} payment${filteredEvents.length > 1 ? 's' : ''} scheduled`
            }
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <div className="mb-2">No payments for this date</div>
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </div>
          ) : (
            filteredEvents.map((event, index) => (
              <Card key={`${event.id}-${index}`} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        {event.type === 'recurring' ? 'Recurring Payment' : 'One-time Payment'}
                      </CardDescription>
                    </div>
                    {getStatusBadge(event.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="pb-0">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="col-span-2">
                      <div className="text-sm text-muted-foreground">Amount</div>
                      <div className="font-semibold text-xl">
                        ${event.amount.toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Payment Method</div>
                      <div>
                        {event.method === 'credit' ? 'Credit Card' : 'Bank Transfer'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Time</div>
                      <div>{event.time || 'All day'}</div>
                    </div>
                    
                    {event.initiatedBy && (
                      <div className="col-span-2">
                        <div className="text-sm text-muted-foreground">Initiated By</div>
                        <div>{event.initiatedBy}</div>
                      </div>
                    )}
                  </div>
                  
                  {event.needsApproval && (
                    <div className="mt-3 rounded-md bg-red-50 p-3 flex gap-2 items-center text-red-700 text-sm">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <p>
                        This transaction requires approval before processing.
                      </p>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between pt-3 mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 text-xs"
                    onClick={() => handleViewDetails(event)}
                  >
                    <FileEdit className="h-3.5 w-3.5" />
                    View Details
                  </Button>
                  
                  {event.status === 'upcoming' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 text-xs"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      Reschedule
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
