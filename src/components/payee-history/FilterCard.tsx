
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { startOfQuarter, endOfQuarter } from "date-fns";
import { Filter } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionStatus, PaymentMethod } from "@/types/transaction";
import { toast } from "sonner";

interface FilterCardProps {
  onApplyFilters: (filters: {
    status: TransactionStatus | "all";
    method: PaymentMethod | "all";
    dateRange: DateRange | undefined;
  }) => void;
}

export const FilterCard = ({ onApplyFilters }: FilterCardProps) => {
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [dateRangeType, setDateRangeType] = useState<"custom" | "thisQuarter">("custom");
  const [filtersChanged, setFiltersChanged] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    status: "all" as TransactionStatus | "all",
    method: "all" as PaymentMethod | "all",
    dateRange: undefined as DateRange | undefined,
  });

  // Handle applying this quarter date range
  useEffect(() => {
    if (dateRangeType === "thisQuarter") {
      const now = new Date();
      const start = startOfQuarter(now);
      const end = endOfQuarter(now);
      setDateRange({ from: start, to: end });
    }
  }, [dateRangeType]);
  
  // Track filter changes
  useEffect(() => {
    if (
      statusFilter !== appliedFilters.status ||
      methodFilter !== appliedFilters.method ||
      dateRange !== appliedFilters.dateRange
    ) {
      setFiltersChanged(true);
    } else {
      setFiltersChanged(false);
    }
  }, [statusFilter, methodFilter, dateRange, appliedFilters]);

  // Handle apply filters
  const handleApplyFilters = () => {
    const newFilters = {
      status: statusFilter,
      method: methodFilter,
      dateRange: dateRange,
    };
    
    setAppliedFilters(newFilters);
    setFiltersChanged(false);
    onApplyFilters(newFilters);
    
    toast.success("Filters applied", {
      description: "Transaction list has been updated"
    });
  };
  
  // Handle reset filters
  const handleResetFilters = () => {
    setStatusFilter("all");
    setMethodFilter("all");
    setDateRange(undefined);
    setDateRangeType("custom");
    
    const resetFilters = {
      status: "all" as TransactionStatus | "all",
      method: "all" as PaymentMethod | "all",
      dateRange: undefined,
    };
    
    setAppliedFilters(resetFilters);
    setFiltersChanged(false);
    onApplyFilters(resetFilters);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="status-filter" className="text-sm font-medium">Payment Status</label>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TransactionStatus | "all")}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="upcoming">Scheduled</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="method-filter" className="text-sm font-medium">Payment Method</label>
            <Select value={methodFilter} onValueChange={(value) => setMethodFilter(value as PaymentMethod | "all")}>
              <SelectTrigger id="method-filter">
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="credit">Credit Card</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Date Range</label>
            <div className="flex gap-2">
              <Select value={dateRangeType} onValueChange={(value) => setDateRangeType(value as "custom" | "thisQuarter")}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Range</SelectItem>
                  <SelectItem value="thisQuarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
              {dateRangeType === "custom" && (
                <DatePickerWithRange 
                  date={dateRange} 
                  setDate={setDateRange} 
                  className="flex-1"
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
          >
            Reset
          </Button>
          <Button 
            variant="default" 
            onClick={handleApplyFilters}
            disabled={!filtersChanged}
          >
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
