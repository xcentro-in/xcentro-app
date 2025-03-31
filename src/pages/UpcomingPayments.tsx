
import { useState, useMemo } from "react";
import { format, addMonths, isBefore, isAfter, addDays, parseISO } from "date-fns";
import { 
  Clock, 
  CreditCard, 
  RefreshCw, 
  AlertTriangle, 
  BarChart3, 
  LayoutGrid, 
  List
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCalendarTransactions } from "@/data/mockCalendarEvents";
import StatCard from "@/components/insights/StatCard";
import PaymentsTableContainer from "@/components/payments/PaymentsTableContainer";
import { Transaction } from "@/types/transaction";
import { useTransactionTable } from "@/hooks/useTransactionTable";
import { CalendarMonthView } from "@/components/calendar/CalendarMonthView";
import { generateMonthData } from "@/utils/calendarUtils";

type ViewMode = "list" | "calendar";

const UpcomingPayments = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return format(now, "yyyy-MM");
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Filter only upcoming transactions (after current date)
  const upcomingTransactions = useMemo(() => {
    const today = new Date();
    return mockCalendarTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return isAfter(transactionDate, today) || transaction.status === 'upcoming';
    });
  }, []);
  
  // Calculate insights
  const insights = useMemo(() => {
    const today = new Date();
    const next7Days = addDays(today, 7);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonth = addMonths(thisMonth, 1);
    
    // Due in next 7 days
    const dueNext7Days = upcomingTransactions.filter(t => {
      const date = new Date(t.date);
      return isAfter(date, today) && isBefore(date, next7Days);
    });
    const dueNext7DaysAmount = dueNext7Days.reduce((sum, t) => sum + t.amount, 0);
    const uniqueVendors = new Set(dueNext7Days.map(t => t.vendor)).size;
    
    // Card-friendly payouts
    const cardFriendlyTransactions = upcomingTransactions.filter(t => 
      t.method === 'credit' || (t.amount < 200000 && t.vendor !== 'Office Rent')
    );
    const cardFriendlyAmount = cardFriendlyTransactions.reduce((sum, t) => sum + t.amount, 0);
    const potentialPoints = Math.floor(cardFriendlyAmount / 100) * 2; // 2 points per ₹100
    
    // Recurring payments
    const recurringThisWeek = upcomingTransactions.filter(t => {
      const date = new Date(t.date);
      return t.isRecurring && isAfter(date, today) && isBefore(date, next7Days);
    });
    
    // Cash-intensive week check
    const highValueDays = upcomingTransactions.reduce((acc, t) => {
      const dateStr = format(new Date(t.date), 'yyyy-MM-dd');
      acc[dateStr] = (acc[dateStr] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    let maxDayAmount = 0;
    let maxDayDate = '';
    Object.entries(highValueDays).forEach(([date, amount]) => {
      if (amount > maxDayAmount) {
        maxDayAmount = amount;
        maxDayDate = date;
      }
    });
    
    // Month-to-date scheduled
    const scheduledThisMonth = upcomingTransactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    });
    const scheduledThisMonthAmount = scheduledThisMonth.reduce((sum, t) => sum + t.amount, 0);
    const monthlyTarget = 1500000; // ₹15L target
    const progressPercentage = (scheduledThisMonthAmount / monthlyTarget) * 100;
    
    return {
      dueNext7Days: {
        amount: dueNext7DaysAmount,
        count: dueNext7Days.length,
        vendors: uniqueVendors
      },
      cardFriendly: {
        amount: cardFriendlyAmount,
        points: potentialPoints,
        count: cardFriendlyTransactions.length
      },
      recurring: {
        count: recurringThisWeek.length
      },
      cashIntensive: {
        amount: maxDayAmount,
        date: maxDayDate ? format(new Date(maxDayDate), 'EEEE') : 'N/A',
        cardEligible: cardFriendlyTransactions.length
      },
      monthToDate: {
        amount: scheduledThisMonthAmount,
        target: monthlyTarget,
        progress: progressPercentage
      }
    };
  }, [upcomingTransactions]);
  
  // Filter transactions based on selected month
  const filteredTransactions = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month
    
    return upcomingTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === startDate.getMonth() && 
        transactionDate.getFullYear() === startDate.getFullYear()
      );
    });
  }, [upcomingTransactions, selectedMonth]);
  
  // Generate month options (next 12 months)
  const monthOptions = useMemo(() => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = addMonths(today, i);
      const value = format(date, 'yyyy-MM');
      const label = format(date, 'MMMM yyyy');
      options.push({ value, label });
    }
    
    return options;
  }, []);
  
  // Setup for the transaction table
  const {
    searchValue,
    setSearchValue,
    sortField,
    sortDirection,
    handleSort,
    itemsPerPage,
    setItemsPerPage
  } = useTransactionTable({
    transactions: upcomingTransactions,
    appliedStatusFilter: "all",
    appliedMethodFilter: "all",
    appliedCategoryFilter: "all",
    appliedDateRange: null
  });
  
  // Create month data for calendar view
  const monthData = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return generateMonthData(date, filteredTransactions);
  }, [filteredTransactions, selectedMonth]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Upcoming Payments</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Manage your scheduled payments and view upcoming dues
          </p>
        </div>
        
        <div className="flex items-center gap-2 animate-slide-down">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="bg-gray-100 rounded-full p-1 flex">
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={() => setViewMode("calendar")}
            >
              <LayoutGrid size={18} />
              <span className="sr-only">Calendar View</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
              <span className="sr-only">List View</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Due in Next 7 Days"
          value={`₹${(insights.dueNext7Days.amount / 1000).toFixed(2)}K`}
          change={8}
          trend="up"
          icon={Clock}
          description={`across ${insights.dueNext7Days.vendors} vendors`}
          index={0}
        />
        
        <StatCard
          title="Card-friendly Payouts"
          value={`₹${(insights.cardFriendly.amount / 1000).toFixed(2)}K`}
          change={12}
          trend="up"
          icon={CreditCard}
          description={`Earn ${insights.cardFriendly.points} points`}
          index={1}
        />
        
        <StatCard
          title="Recurring Payments"
          value={`${insights.recurring.count} payments`}
          change={0}
          trend="up"
          icon={RefreshCw}
          description="auto-scheduled this week"
          index={2}
        />
        
        <StatCard
          title="Cash-Intensive Day"
          value={`₹${(insights.cashIntensive.amount / 1000).toFixed(2)}K`}
          change={15}
          trend="up"
          icon={AlertTriangle}
          description={`due on ${insights.cashIntensive.date}`}
          index={3}
        />
        
        <StatCard
          title="Month-to-Date Scheduled"
          value={`₹${(insights.monthToDate.amount / 100000).toFixed(1)}L`}
          change={insights.monthToDate.progress}
          trend="up"
          icon={BarChart3}
          description={`of ₹${insights.monthToDate.target / 100000}L target`}
          index={4}
        />
      </div>
      
      {/* Main Content - List or Calendar View */}
      <Card>
        <CardContent className="p-6">
          {viewMode === "list" ? (
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
          ) : (
            <div className="calendar-view">
              <CalendarMonthView 
                weeks={monthData.weeks}
                onDayClick={() => {}}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpcomingPayments;
