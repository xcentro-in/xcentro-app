
import React from "react";
import { format } from "date-fns";
import { CalendarDay } from "@/types/calendar";
import CalendarEventsList from "./CalendarEventsList";

interface CalendarWeekViewProps {
  days: CalendarDay[];
  filterType: string;
  onDayClick: (day: CalendarDay) => void;
}

const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
  days,
  filterType,
  onDayClick
}) => {
  return (
    <div className="calendar-week-view">
      <div className="grid grid-cols-7 gap-2 mb-3">
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`
              flex flex-col items-center gap-1 p-2 cursor-pointer
              ${day.isToday ? 'bg-primary/10 rounded-md' : ''}
              ${!day.isCurrentMonth ? 'opacity-40' : ''}
            `}
            onClick={() => onDayClick(day)}
          >
            <div className="text-xs text-muted-foreground">
              {format(day.date, 'EEE')}
            </div>
            <div className={`
              text-lg font-semibold h-9 w-9 flex items-center justify-center rounded-full
              ${day.isToday ? 'bg-primary text-white' : ''}
            `}>
              {format(day.date, 'd')}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(day.date, 'MMM')}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`
              min-h-[300px] border rounded-md p-2
              ${day.isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
              ${!day.isCurrentMonth ? 'bg-gray-50 opacity-70' : 'bg-white'}
            `}
          >
            <CalendarEventsList
              events={day.events}
              filterType={filterType}
              onEventClick={() => onDayClick(day)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWeekView;
