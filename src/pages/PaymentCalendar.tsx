
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarDay, MonthData } from "@/types/calendar";
import { generateMonthData } from "@/utils/calendarUtils";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarMonthView from "@/components/calendar/CalendarMonthView";
import CalendarEventDetails from "@/components/calendar/CalendarEventDetails";
import UpcomingPaymentsTableContainer from "@/components/payments/payment-history/tables/UpcomingPaymentsTableContainer";
import ViewToggler from "@/components/payments/shared/ui/ViewToggler";
import PaymentCalendarHeader from "@/components/payments/shared/ui/PaymentCalendarHeader";
import PaymentInsightsGrid from "@/components/payments/upcoming-payments/insights/PaymentInsightsGrid";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useUpcomingPayments } from "@/hooks/useUpcomingPayments";
import { useAuth } from "@/contexts/AuthContext";
import { canViewFeature } from "@/lib/featureFlags";

type ViewType = "list" | "calendar";

const PaymentCalendar = () => {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("Payment Calendar");
  }, [setTitle]);

  // Simplified state - only for view management and calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [activeView, setActiveView] = useState<ViewType>("calendar");

  // Check if user has access to advanced calendar features (list view, insights)
  const { user } = useAuth();
  const showAdvancedViews = canViewFeature('PAYMENT_CALENDAR_ADVANCED', user);

  // Fetch calendar data for the selected month (calendar view only)
  const { payments: calendarPayments, isLoading: isLoadingCalendar } = useUpcomingPayments({
    month: selectedMonth // For calendar view - gets all payments in this month
  });

  // Generate calendar data when payments or month changes
  useEffect(() => {
    if (calendarPayments && selectedMonth) {
      const [year, month] = selectedMonth.split('-').map(Number);
      const monthStartDate = new Date(year, month - 1, 1);
      const data = generateMonthData(monthStartDate, calendarPayments);
      setMonthData(data);
      setCurrentDate(monthStartDate);
    }
  }, [selectedMonth, calendarPayments]);
  
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
      {activeView === "calendar" || !showAdvancedViews ? (
        <div className="bg-white rounded-xl border shadow-sm p-6 animate-fade-in">
          <CalendarHeader
            currentDate={currentDate}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onMonthSelect={handleMonthSelect}
            activeView={showAdvancedViews ? activeView : "calendar"}
            onViewChange={showAdvancedViews ? setActiveView : undefined}
          />

          <div className="mt-6">
            {isLoadingCalendar ? (
              <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
            ) : (
              monthData && (
                <CalendarMonthView
                  weeks={monthData.weeks}
                  onDayClick={handleDayClick}
                />
              )
            )}
          </div>
        </div>
      ) : (
        <>
          <PaymentCalendarHeader
            description="View and manage all your scheduled payments in one place"
          />

          <div className="flex justify-between items-center mb-2">
            {/* Note: Month selector removed from table view as per requirements */}
            <div></div> {/* Placeholder for layout */}

            <ViewToggler
              activeView={activeView}
              onViewChange={setActiveView}
            />
          </div>

          <PaymentInsightsGrid />

          <div className="calendar-container rounded-xl border bg-white animate-fade-in">
            <UpcomingPaymentsTableContainer />
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
