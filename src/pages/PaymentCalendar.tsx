
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format, parse, isSameMonth, getMonth, getYear } from "date-fns";
import { CalendarDays, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarDay, MonthData } from "@/types/calendar";
import { generateMonthData, navigateMonth } from "@/utils/calendarUtils";
import { mockCalendarTransactions } from "@/data/mockCalendarEvents";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarMonthView from "@/components/calendar/CalendarMonthView";
import CalendarEventDetails from "@/components/calendar/CalendarEventDetails";

const PaymentCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Generate the calendar data
  useEffect(() => {
    const data = generateMonthData(currentDate, mockCalendarTransactions);
    setMonthData(data);
  }, [currentDate]);
  
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
  
  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
    setDetailsOpen(true);
  };
  
  const handleExport = () => {
    toast.success(
      "Calendar data exported successfully", 
      { description: `Payments for ${format(currentDate, 'MMMM yyyy')}` }
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Upcoming Payments</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            View and manage all your scheduled payments in one place
          </p>
        </div>
        
        <div className="flex gap-3 animate-slide-down" style={{ animationDelay: "100ms" }}>
          <Button 
            variant="outline" 
            className="h-10 gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export Calendar
          </Button>
          <Button 
            className="h-10 gap-2"
            onClick={() => navigate("/new-payment")}
          >
            <CalendarDays className="h-4 w-4" />
            Schedule Payment
          </Button>
        </div>
      </div>
      
      <div className="calendar-container rounded-xl border p-4 bg-white animate-fade-in">
        <CalendarHeader 
          currentDate={currentDate}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onMonthSelect={handleMonthSelect}
          onExport={handleExport}
        />
        
        <div className="mt-6">
          {monthData && (
            <CalendarMonthView 
              weeks={monthData.weeks}
              onDayClick={handleDayClick}
            />
          )}
        </div>
      </div>
      
      <CalendarEventDetails
        open={detailsOpen}
        selectedDay={selectedDay}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
};

export default PaymentCalendar;
