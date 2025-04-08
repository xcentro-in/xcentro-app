
import React from "react";
import { CalendarDay } from "@/types/calendar";
import CalendarDayCell from "./CalendarDayCell";

interface CalendarMonthViewProps {
  weeks: { days: CalendarDay[] }[];
  onDayClick: (day: CalendarDay) => void;
}

const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  weeks,
  onDayClick
}) => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="calendar-month-view">
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((day) => (
          <div 
            key={day} 
            className="text-sm font-medium text-center py-2 text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.days.map((day, dayIndex) => (
              <CalendarDayCell
                key={`${weekIndex}-${dayIndex}`}
                day={day}
                filterType="all" // Adding a default value for filterType
                onClick={() => onDayClick(day)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarMonthView;
