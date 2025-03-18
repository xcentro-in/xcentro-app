
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
  addMonths,
  subMonths,
  getMonth,
  getYear,
  parseISO,
  isSameDay
} from "date-fns";
import { CalendarDay, CalendarWeek, MonthData, CalendarEvent } from "@/types/calendar";
import { Transaction } from "@/types/transaction";

export const generateMonthData = (
  date: Date, 
  transactions: Transaction[]
): MonthData => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const weeks: CalendarWeek[] = [];
  let week: CalendarDay[] = [];

  calendarDays.forEach((day, index) => {
    const events = getEventsForDay(day, transactions);
    
    week.push({
      date: day,
      events,
      isCurrentMonth: isSameMonth(day, date),
      isToday: isToday(day)
    });

    if (index % 7 === 6 || index === calendarDays.length - 1) {
      weeks.push({ days: [...week] });
      week = [];
    }
  });

  return {
    weeks,
    monthYear: format(date, "MMMM yyyy")
  };
};

export const getEventsForDay = (day: Date, transactions: Transaction[]): CalendarEvent[] => {
  return transactions
    .filter(transaction => {
      const transactionDate = typeof transaction.date === 'string' 
        ? parseISO(transaction.date) 
        : transaction.date;
      
      const scheduledDate = transaction.scheduledDate 
        ? parseISO(transaction.scheduledDate) 
        : null;
        
      return (
        (transactionDate && isSameDay(transactionDate, day)) || 
        (scheduledDate && isSameDay(scheduledDate, day))
      );
    })
    .map(transaction => ({
      id: transaction.id,
      title: transaction.vendor,
      amount: transaction.amount,
      status: transaction.status,
      method: transaction.method,
      type: transaction.type,
      time: format(
        typeof transaction.date === 'string' ? parseISO(transaction.date) : transaction.date, 
        'h:mm a'
      ),
      initiatedBy: transaction.initiatedBy?.name,
      needsApproval: transaction.status === 'pending_approval'
    }));
};

export const navigateMonth = (
  date: Date, 
  direction: 'next' | 'prev'
): Date => {
  return direction === 'next' ? addMonths(date, 1) : subMonths(date, 1);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'recurring':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'upcoming':
    case 'scheduled':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'pending':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'pending_approval':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'completed':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-green-100 text-green-800 border-green-300';
  }
};

export const getMethodIcon = (method: string) => {
  switch (method) {
    case 'credit':
      return '💳';
    case 'bank':
      return '🏦';
    default:
      return '💼';
  }
};

export const getMonthsOptions = () => {
  const currentDate = new Date();
  const currentMonth = getMonth(currentDate);
  const currentYear = getYear(currentDate);
  
  const options = [];
  
  // Past 6 months + current month + future 6 months
  for (let i = -6; i <= 6; i++) {
    const date = new Date(currentYear, currentMonth + i, 1);
    options.push({
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy')
    });
  }
  
  return options;
};
