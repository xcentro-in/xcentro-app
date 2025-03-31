
import React, { useState, useEffect } from 'react';
import { format, isSameMonth, getMonth, getYear, parseISO } from 'date-fns';
import { CalendarEvent, CalendarDay } from '@/types/calendar';
import { Transaction } from '@/types/transaction';
import { generateMonthData, navigateMonth } from '@/utils/calendarUtils';
import CalendarMonthView from '@/components/calendar/CalendarMonthView';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarEventDetails from '@/components/calendar/CalendarEventDetails';

interface PaymentCalendarViewProps {
  transactions: Transaction[];
  selectedMonth: string;
}

const PaymentCalendarView: React.FC<PaymentCalendarViewProps> = ({ 
  transactions,
  selectedMonth
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month - 1, 1);
  });
  
  const [monthData, setMonthData] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  
  // When the month changes, update the calendar data
  useEffect(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    setCurrentDate(date);
  }, [selectedMonth]);
  
  // Generate calendar data based on the current date
  useEffect(() => {
    const data = generateMonthData(currentDate, transactions);
    setMonthData(data);
  }, [currentDate, transactions]);
  
  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
    setDetailsOpen(true);
  };
  
  if (!monthData) {
    return <div className="p-8 text-center">Loading calendar...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="calendar-container bg-white animate-fade-in">
        <div className="mt-2">
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

export default PaymentCalendarView;
