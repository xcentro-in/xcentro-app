
import React from "react";
import { CalendarDay } from "@/types/calendar";
import CalendarDayCell from "./CalendarDayCell";

interface CalendarMonthViewProps {
  weeks: { days: CalendarDay[] }[];
  filterType: string;
  onDayClick: (day: CalendarDay) => void;
}

const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  weeks,
  filterType,
  onDayClick
}) => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="calendar-month-view bg-gradient-to-br from-white/50 to-blue-50/30 p-4 rounded-lg backdrop-blur-sm">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div 
            key={day} 
            className="text-sm font-medium text-center py-2 text-primary"
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
                filterType={filterType}
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
