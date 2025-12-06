
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarDay, MonthData, CalendarEvent } from "@/types/calendar";
import { generateMonthData } from "@/utils/calendarUtils";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarMonthView from "@/components/calendar/CalendarMonthView";
import CalendarEventDetails from "@/components/calendar/CalendarEventDetails";
import UpcomingPaymentsTableContainer from "@/components/payments/payment-history/tables/UpcomingPaymentsTableContainer";
import ViewToggler from "@/components/payments/shared/ui/ViewToggler";
import PaymentCalendarHeader from "@/components/payments/shared/ui/PaymentCalendarHeader";
import PaymentInsightsGrid from "@/components/payments/upcoming-payments/insights/PaymentInsightsGrid";
import PaymentMethodAndReviewStep, { PaymentItem } from "@/components/payments/shared/PaymentMethodAndReviewStep";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useUpcomingPayments } from "@/hooks/useUpcomingPayments";
import { useAuth } from "@/contexts/AuthContext";
import { canViewFeature } from "@/lib/featureFlags";
import { useBills } from "@/hooks/useBills";
import { useVoucherCounts } from "@/hooks/useVoucherCounts";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type ViewType = "list" | "calendar";

const PaymentCalendar = () => {
  const { setTitle } = usePageTitle();
  const { user, userRoles } = useAuth();

  // Get user's role for the current business - Note: PaymentCalendar doesn't use businessId directly
  // but we need role for feature flags. Using first role as fallback.
  const currentUserRole = userRoles[0]?.role || '';

  // Create feature flag compatible user object
  const featureFlagUser = { id: user?.id || '', role: currentUserRole as any };

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

  // Payment view state
  const [isPaymentView, setIsPaymentView] = useState(false);
  const [selectedEventForPayment, setSelectedEventForPayment] = useState<CalendarEvent | null>(null);

  // Check if user has access to advanced calendar features (list view, insights)
  const showAdvancedViews = canViewFeature('PAYMENT_CALENDAR_ADVANCED', featureFlagUser);

  // Get payBill function from useBills hook
  const { payBill } = useBills({ status: 'all', page: 1, limit: 10, sortBy: 'dueDate', sortOrder: 'asc' });
  const { refetch: refetchCounts } = useVoucherCounts();

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

  const handlePayBill = async (billId: string) => {
    // Find the event from selected day's events
    if (selectedDay) {
      const eventToPay = selectedDay.events.find(event => String(event.id) === billId);
      if (eventToPay) {
        setSelectedEventForPayment(eventToPay);
        setIsPaymentView(true);
        setDetailsOpen(false); // Close the details drawer
      }
    }
  };

  const handleBackToCalendar = () => {
    setIsPaymentView(false);
    setSelectedEventForPayment(null);
  };

  const handlePaymentSubmit = async () => {
    if (selectedEventForPayment) {
      try {
        await payBill(String(selectedEventForPayment.id));
        refetchCounts();
        handleBackToCalendar();
        console.log('Bill paid successfully');
      } catch (error) {
        console.error('Failed to pay bill:', error);
      }
    }
  };

  // Prepare payment items when in payment view
  const paymentItems: PaymentItem[] = selectedEventForPayment
    ? [
        {
          id: String(selectedEventForPayment.id),
          name: selectedEventForPayment.title,
          amount: selectedEventForPayment.amount,
          description: selectedEventForPayment.invoiceNumber
            ? `Invoice #${selectedEventForPayment.invoiceNumber}`
            : selectedEventForPayment.description || 'Payment',
        },
      ]
    : [];

  // If in payment view, render the payment component
  if (isPaymentView && selectedEventForPayment) {
    return (
      <div className="h-full flex flex-col">
        {/* Header with back button */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackToCalendar}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Calendar
            </Button>
            <span className="text-lg font-semibold">Pay Bill</span>
          </div>
        </div>

        {/* Payment Component */}
        <div className="flex-1 overflow-auto p-6">
          <PaymentMethodAndReviewStep
            totalAmount={selectedEventForPayment.amount}
            paymentItems={paymentItems}
            summaryType="list"
            onBack={handleBackToCalendar}
            onSubmit={handlePaymentSubmit}
            additionalSummaryData={{
              itemLabel: "Number of Bills",
              amountLabel: "Bill Amount",
              listTitle: `Bill Details (1)`,
            }}
            paymentContext="vendor_payment"
            voucherIds={[String(selectedEventForPayment.id)]}
          />
        </div>
      </div>
    );
  }

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
        onPayBill={handlePayBill}
      />
    </div>
  );
};

export default PaymentCalendar;
