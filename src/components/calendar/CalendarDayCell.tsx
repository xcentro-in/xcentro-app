
import React from "react";
import { format } from "date-fns";
import { CalendarDay, CalendarEvent } from "@/types/calendar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getStatusColor, getMethodIcon } from "@/utils/calendarUtils";

interface CalendarDayCellProps {
  day: CalendarDay;
  filterType: string;
  onClick: () => void;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({ day, filterType, onClick }) => {
  const { date, events, isCurrentMonth, isToday } = day;
  
  const filteredEvents = events.filter(event => {
    if (filterType === 'all') return true;
    if (filterType === 'recurring') return event.type === 'recurring';
    if (filterType === 'scheduled') return event.status === 'upcoming';
    if (filterType === 'completed') return event.status === 'completed';
    if (filterType === 'pending') return event.status === 'pending' || event.status === 'pending_approval';
    return true;
  });

  const dayClasses = `
    -z-5 h-32 p-1 border rounded-md transition-all
    ${isCurrentMonth ? 'bg-white/95 backdrop-blur-sm' : 'bg-gray-50/90 text-gray-400'}
    ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
    hover:border-primary hover:shadow-md cursor-pointer
  `;

  return (
    <div className={dayClasses} onClick={onClick}>
      <div className="flex justify-between items-start">
        <span className={`text-sm font-medium p-1 rounded-full w-6 h-6 flex items-center justify-center ${isToday ? 'bg-primary text-white' : ''}`}>
          {format(date, 'd')}
        </span>
        {filteredEvents.length > 0 && (
          <span className="text-xs bg-primary/10 px-1.5 py-0.5 rounded-full text-primary font-medium">
            {filteredEvents.length}
          </span>
        )}
      </div>
      
      <div className="mt-1 space-y-1 overflow-hidden">
        {filteredEvents.length > 0 && (
          <>
            {/* Always show the first event */}
            <Tooltip key={`${filteredEvents[0].id}`} delayDuration={300}>
              <TooltipTrigger asChild>
                <div 
                  className={`
                    text-[10px] px-1.5 py-0.5 rounded truncate border shadow-sm
                    ${getStatusColor(filteredEvents[0].status)}
                  `}
                >
                  <div className="flex items-center gap-1">
                    <span>{getMethodIcon(filteredEvents[0].method)}</span>
                    <span className="truncate">{filteredEvents[0].title}</span>
                  </div>
                  <div className="font-semibold mt-0.5 truncate">
                    ${filteredEvents[0].amount.toLocaleString()}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" align="start" sideOffset={16} alignOffset={-8} className="p-3 max-w-xs bg-white/95 backdrop-blur-sm border-primary/20 z-100">
                <div className="font-semibold mb-1">{filteredEvents[0].title}</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">${filteredEvents[0].amount.toLocaleString()}</span>
                  
                  <span className="text-muted-foreground">Method:</span>
                  <span className="font-medium">{filteredEvents[0].method === 'credit' ? 'Credit Card' : 'Bank Transfer'}</span>
                  
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">{filteredEvents[0].type}</span>
                  
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">{filteredEvents[0].status.replace('_', ' ')}</span>
                  
                  {filteredEvents[0].initiatedBy && (
                    <>
                      <span className="text-muted-foreground">Initiated By:</span>
                      <span className="font-medium">{filteredEvents[0].initiatedBy}</span>
                    </>
                  )}
                  
                  {filteredEvents[0].time && (
                    <>
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{filteredEvents[0].time}</span>
                    </>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
            
            {/* If there are more events, show a "+X more" indicator */}
            {filteredEvents.length > 1 && (
              <div className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-center border border-gray-200">
                +{filteredEvents.length - 1} more
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarDayCell;
