
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarDay, CalendarViewType, CalendarFilterType, MonthData } from "@/types/calendar";
import { generateMonthData, navigateMonth } from "@/utils/calendarUtils";
import { mockCalendarTransactions } from "@/data/mockCalendarEvents";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarMonthView from "@/components/calendar/CalendarMonthView";
import CalendarWeekView from "@/components/calendar/CalendarWeekView";
import CalendarEventDetails from "@/components/calendar/CalendarEventDetails";

const PaymentCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  const [viewType, setViewType] = useState<CalendarViewType>("month");
  const [filterType, setFilterType] = useState<CalendarFilterType>("all");
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [weekViewDays, setWeekViewDays] = useState<CalendarDay[]>([]);
  
  // Generate the calendar data
  useEffect(() => {
    const data = generateMonthData(currentDate, mockCalendarTransactions);
    setMonthData(data);
    
    // For week view, get the current week
    if (viewType === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      
      // Find the week that contains the current date
      let currentWeekDays: CalendarDay[] = [];
      data.weeks.forEach(week => {
        if (week.days.some(day => 
          day.date >= weekStart && day.date <= weekEnd
        )) {
          currentWeekDays = week.days;
        }
      });
      
      setWeekViewDays(currentWeekDays);
    }
  }, [currentDate, viewType]);
  
  const handlePrevious = () => {
    setCurrentDate(navigateMonth(currentDate, 'prev'));
  };
  
  const handleNext = () => {
    setCurrentDate(navigateMonth(currentDate, 'next'));
  };
  
  const handleMonthSelect = (value: string) => {
    const [year, month] = value.split('-').map(Number);
    const newDate = new Date(year, month - 1, 1);
    setCurrentDate(newDate);
  };
  
  const handleViewChange = (view: CalendarViewType) => {
    setViewType(view);
  };
  
  const handleFilterChange = (filter: CalendarFilterType) => {
    setFilterType(filter);
  };
  
  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
    setDetailsOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Payment Calendar</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            View and manage all your scheduled payments in one place
          </p>
        </div>
        
        <div className="flex gap-3 animate-slide-down" style={{ animationDelay: "100ms" }}>
          <Button 
            className="h-10 gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
            onClick={() => navigate("/new-payment")}
          >
            <CalendarDays className="h-4 w-4" />
            Schedule Payment
          </Button>
        </div>
      </div>
      
      <div className="calendar-container rounded-xl border p-4 bg-gradient-to-br from-slate-50 to-blue-50/70 shadow-sm animate-fade-in">
        <CalendarHeader 
          currentDate={currentDate}
          viewType={viewType}
          filterType={filterType}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onViewChange={handleViewChange}
          onFilterChange={handleFilterChange}
          onMonthSelect={handleMonthSelect}
        />
        
        <div className="mt-6">
          {viewType === "month" && monthData && (
            <CalendarMonthView 
              weeks={monthData.weeks} 
              filterType={filterType}
              onDayClick={handleDayClick}
            />
          )}
          
          {viewType === "week" && weekViewDays.length > 0 && (
            <CalendarWeekView 
              days={weekViewDays} 
              filterType={filterType}
              onDayClick={handleDayClick}
            />
          )}
        </div>
      </div>
      
      <CalendarEventDetails
        open={detailsOpen}
        selectedDay={selectedDay}
        filterType={filterType}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
};

export default PaymentCalendar;
