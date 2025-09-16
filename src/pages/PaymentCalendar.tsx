
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parse, isSameMonth, getMonth, getYear, isAfter, isBefore, parseISO, addDays } from "date-fns";
import { Card } from "@/components/ui/card";
import { CalendarDay, MonthData } from "@/types/calendar";
import { Transaction } from "@/types/transaction";
import { generateMonthData, getMonthsOptions } from "@/utils/calendarUtils";
import { mockCalendarTransactions } from "@/data/mockCalendarEvents";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarMonthView from "@/components/calendar/CalendarMonthView";
import CalendarEventDetails from "@/components/calendar/CalendarEventDetails";
import UpcomingPaymentsTableContainer from "@/components/payments/UpcomingPaymentsTableContainer";
import { useTransactionTable } from "@/hooks/useTransactionTable";
import MonthSelector from "@/components/payments/MonthSelector";
import ViewToggler from "@/components/payments/ViewToggler";
import PaymentCalendarHeader from "@/components/payments/PaymentCalendarHeader";
import PaymentInsightsGrid from "@/components/payments/PaymentInsightsGrid";
import { usePageTitle } from "@/contexts/PageTitleContext";

type ViewType = "list" | "calendar";

const PaymentCalendar = () => {
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();
  
  useEffect(() => {
    setTitle("Upcoming Payments");
  }, [setTitle]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [activeView, setActiveView] = useState<ViewType>("list");
  const [upcomingTransactions, setUpcomingTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    const today = new Date();
    const filteredTransactions = mockCalendarTransactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return isAfter(transactionDate, today) || transaction.status === 'upcoming';
    });
    
    setUpcomingTransactions(filteredTransactions);
  }, []);
  
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of selected month
      
      const filtered = upcomingTransactions.filter(transaction => {
        const transactionDate = parseISO(transaction.date);
        return (
          isAfter(transactionDate, startDate) || 
          transaction.date.startsWith(format(startDate, 'yyyy-MM'))
        ) && 
        (isBefore(transactionDate, endDate) || 
         transaction.date.startsWith(format(endDate, 'yyyy-MM')));
      });
      
      setFilteredTransactions(filtered);
    }
  }, [selectedMonth, upcomingTransactions]);
  
  useEffect(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const monthStartDate = new Date(year, month - 1, 1);
    const data = generateMonthData(monthStartDate, upcomingTransactions);
    setMonthData(data);
    setCurrentDate(monthStartDate);
  }, [selectedMonth, upcomingTransactions]);
  
  const {
    searchValue,
    setSearchValue,
    sortField,
    sortDirection,
    itemsPerPage,
    setItemsPerPage,
    handleSort,
  } = useTransactionTable({
    transactions: filteredTransactions,
    appliedStatusFilter: "all",
    appliedMethodFilter: "all",
    appliedCategoryFilter: "all",
    appliedDateRange: undefined
  });
  
  const handlePrevious = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const prevMonth = new Date(year, month - 2, 1); // -2 because months are 0-indexed
    setSelectedMonth(format(prevMonth, 'yyyy-MM'));
  };
  
  const handleNext = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const nextMonth = new Date(year, month, 1); // This will automatically roll to the next month
    setSelectedMonth(format(nextMonth, 'yyyy-MM'));
  };
  
  const handleMonthSelect = (value: string) => {
    setSelectedMonth(value);
  };
  
  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
    setDetailsOpen(true);
  };
  
  return (
    <div className="space-y-8">
      {activeView === "calendar" ? (
        <div className="bg-white rounded-xl border shadow-sm p-6 animate-fade-in">
          <CalendarHeader 
            currentDate={currentDate}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onMonthSelect={handleMonthSelect}
            activeView={activeView}
            onViewChange={setActiveView}
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
      ) : (
        <>
          <PaymentCalendarHeader 
            description="View and manage all your scheduled payments in one place"
          />
          
          <div className="flex justify-between items-center mb-2">
            <MonthSelector 
              selectedMonth={selectedMonth} 
              onMonthSelect={handleMonthSelect} 
            />
            
            <ViewToggler 
              activeView={activeView} 
              onViewChange={setActiveView}
            />
          </div>
          
          <PaymentInsightsGrid transactions={upcomingTransactions} />
          
          <div className="calendar-container rounded-xl border bg-white animate-fade-in">
            <UpcomingPaymentsTableContainer 
              transactions={filteredTransactions}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </>
      )}
      
      <CalendarEventDetails
        open={detailsOpen}
        selectedDay={selectedDay}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
};

export default PaymentCalendar;
