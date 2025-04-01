import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format, parse, isSameMonth, getMonth, getYear, isAfter, isBefore, parseISO, addDays } from "date-fns";
import { 
  CalendarDays, 
  Clock, 
  CreditCard, 
  RefreshCw, 
  AlertTriangle, 
  BarChart3, 
  List 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDay, MonthData } from "@/types/calendar";
import { Transaction } from "@/types/transaction";
import { generateMonthData, navigateMonth, getMonthsOptions } from "@/utils/calendarUtils";
import { mockCalendarTransactions } from "@/data/mockCalendarEvents";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarMonthView from "@/components/calendar/CalendarMonthView";
import CalendarEventDetails from "@/components/calendar/CalendarEventDetails";
import PaymentsTableContainer from "@/components/payments/PaymentsTableContainer";
import { useTransactionTable } from "@/hooks/useTransactionTable";
import PaymentInsightCard from "@/components/insights/PaymentInsightCard";

type ViewType = "list" | "calendar";

const PaymentCalendar = () => {
  const navigate = useNavigate();
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
  
  const insightStats = {
    dueNext7Days: {
      amount: upcomingTransactions
        .filter(t => {
          const txDate = parseISO(t.date);
          const next7Days = addDays(new Date(), 7);
          return isBefore(txDate, next7Days) && isAfter(txDate, new Date());
        })
        .reduce((sum, t) => sum + t.amount, 0),
      count: upcomingTransactions
        .filter(t => {
          const txDate = parseISO(t.date);
          const next7Days = addDays(new Date(), 7);
          return isBefore(txDate, next7Days) && isAfter(txDate, new Date());
        }).length
    },
    cardFriendly: {
      amount: upcomingTransactions
        .filter(t => t.method === 'credit' || t.vendor.toLowerCase().includes('utility'))
        .reduce((sum, t) => sum + t.amount, 0),
      potential: Math.floor(2500 + Math.random() * 1500)
    },
    recurring: {
      count: upcomingTransactions.filter(t => t.isRecurring).length,
      thisWeek: upcomingTransactions.filter(t => {
        const txDate = parseISO(t.date);
        const next7Days = addDays(new Date(), 7);
        return isBefore(txDate, next7Days) && t.isRecurring;
      }).length
    },
    cashIntensive: {
      amount: upcomingTransactions
        .filter(t => t.amount > 25000 && t.method === 'bank')
        .reduce((sum, t) => sum + t.amount, 0),
      count: upcomingTransactions.filter(t => t.amount > 25000 && t.method === 'bank').length
    },
    monthToDate: {
      scheduled: upcomingTransactions
        .filter(t => t.date.startsWith(format(new Date(), 'yyyy-MM')))
        .reduce((sum, t) => sum + t.amount, 0),
      target: 1500000, // 15 lakhs target
    }
  };
  
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
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-3 animate-slide-up">Upcoming Payments</h1>
              <p className="text-muted-foreground mb-4 animate-slide-up" style={{ animationDelay: "50ms" }}>
                View and manage all your scheduled payments in one place
              </p>
            </div>
            
            <div className="flex items-center gap-3 animate-slide-down" style={{ animationDelay: "100ms" }}>
              <Button 
                className="h-10 gap-2"
                onClick={() => navigate("/new-payment")}
              >
                <CalendarDays className="h-4 w-4" />
                Schedule Payment
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="w-[180px]">
              <Select value={selectedMonth} onValueChange={handleMonthSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {getMonthsOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex border rounded-lg overflow-hidden">
              <Button 
                variant={activeView === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none px-2"
                onClick={() => setActiveView("list")}
                title="List View"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant={activeView === "calendar" ? "default" : "ghost"}
                size="sm"
                className="rounded-none px-2"
                onClick={() => setActiveView("calendar")}
                title="Calendar View"
              >
                <CalendarDays className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <PaymentInsightCard
              title="Due in Next 7 Days"
              value={`₹${insightStats.dueNext7Days.amount.toLocaleString()}`}
              description={`across ${insightStats.dueNext7Days.count} vendors`}
              icon={Clock}
              iconColor="text-green-500"
              iconBgColor="bg-green-500/10"
              animationDelay={0}
            />
            
            <PaymentInsightCard
              title="Card-friendly Payouts"
              value={`₹${insightStats.cardFriendly.amount.toLocaleString()}`}
              description={`Earn ${insightStats.cardFriendly.potential} points`}
              icon={CreditCard}
              iconColor="text-blue-500"
              iconBgColor="bg-blue-500/10"
              animationDelay={50}
              accentText={true}
            />
            
            <PaymentInsightCard
              title="Recurring Payments"
              value={`${insightStats.recurring.count} Payments`}
              description={`${insightStats.recurring.thisWeek} auto-scheduled this week`}
              icon={RefreshCw}
              iconColor="text-purple-500"
              iconBgColor="bg-purple-500/10"
              animationDelay={100}
            />
            
            <PaymentInsightCard
              title="Cash-Intensive Week"
              value={`₹${insightStats.cashIntensive.amount.toLocaleString()}`}
              description={`Consider using card for ${Math.min(3, insightStats.cashIntensive.count)} of ${insightStats.cashIntensive.count} payouts`}
              icon={AlertTriangle}
              iconColor="text-amber-500"
              iconBgColor="bg-amber-500/10"
              animationDelay={150}
              accentText={true}
            />
            
            <Card className="animate-scale-in" style={{ animationDelay: "200ms" }}>
              <CardContent className="p-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-sm">Month-to-Date</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((insightStats.monthToDate.scheduled / insightStats.monthToDate.target) * 100)}%
                    </span>
                  </div>
                  
                  <div className="text-2xl font-bold">
                    ₹{Math.round(insightStats.monthToDate.scheduled / 100000).toLocaleString()}L
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    of ₹{Math.round(insightStats.monthToDate.target / 100000)}L target
                  </div>
                  
                  <Progress
                    value={(insightStats.monthToDate.scheduled / insightStats.monthToDate.target) * 100}
                    className="h-2 mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="calendar-container rounded-xl border bg-white animate-fade-in">
            <PaymentsTableContainer 
              transactions={filteredTransactions}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
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
