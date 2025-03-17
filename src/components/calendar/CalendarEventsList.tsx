
import React from "react";
import { CalendarEvent } from "@/types/calendar";
import { getStatusColor, getMethodIcon } from "@/utils/calendarUtils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CalendarEventsListProps {
  events: CalendarEvent[];
  filterType: string;
  onEventClick: (event: CalendarEvent) => void;
}

const CalendarEventsList: React.FC<CalendarEventsListProps> = ({
  events,
  filterType,
  onEventClick
}) => {
  const filteredEvents = events.filter(event => {
    if (filterType === 'all') return true;
    if (filterType === 'recurring') return event.type === 'recurring';
    if (filterType === 'scheduled') return event.status === 'upcoming';
    if (filterType === 'completed') return event.status === 'completed';
    if (filterType === 'pending') return event.status === 'pending' || event.status === 'pending_approval';
    return true;
  });

  if (filteredEvents.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        No events
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredEvents.map((event, index) => (
        <Tooltip key={`${event.id}-${index}`} delayDuration={300}>
          <TooltipTrigger asChild>
            <div 
              className={`
                p-2 rounded border text-sm cursor-pointer
                ${getStatusColor(event.status)}
                hover:shadow-sm transition-shadow
              `}
              onClick={() => onEventClick(event)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-medium truncate">
                  <span>{getMethodIcon(event.method)}</span>
                  <span className="truncate">{event.title}</span>
                </div>
                {event.time && (
                  <div className="text-xs opacity-80">{event.time}</div>
                )}
              </div>
              <div className="font-semibold mt-1">
                ${event.amount.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="capitalize">{event.status.replace('_', ' ')}</span>
                <span className="capitalize">{event.type}</span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="p-3 max-w-xs">
            <div className="font-semibold mb-1">{event.title}</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">${event.amount.toLocaleString()}</span>
              
              <span className="text-muted-foreground">Method:</span>
              <span className="font-medium">{event.method === 'credit' ? 'Credit Card' : 'Bank Transfer'}</span>
              
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium capitalize">{event.type}</span>
              
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium capitalize">{event.status.replace('_', ' ')}</span>
              
              {event.initiatedBy && (
                <>
                  <span className="text-muted-foreground">Initiated By:</span>
                  <span className="font-medium">{event.initiatedBy}</span>
                </>
              )}
              
              {event.time && (
                <>
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{event.time}</span>
                </>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default CalendarEventsList;
