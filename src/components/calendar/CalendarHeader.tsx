
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarViewType, CalendarFilterType } from "@/types/calendar";
import { getMonthsOptions } from "@/utils/calendarUtils";

interface CalendarHeaderProps {
  currentDate: Date;
  viewType: CalendarViewType;
  filterType: CalendarFilterType;
  onPrevious: () => void;
  onNext: () => void;
  onViewChange: (view: CalendarViewType) => void;
  onFilterChange: (filter: CalendarFilterType) => void;
  onMonthSelect: (value: string) => void;
  onExport: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewType,
  filterType,
  onPrevious,
  onNext,
  onViewChange,
  onFilterChange,
  onMonthSelect,
}) => {
  const monthOptions = getMonthsOptions();
  const currentMonthValue = format(currentDate, 'yyyy-MM');
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            aria-label="Previous month"
            className="bg-white/80 hover:bg-primary/10 hover:text-primary border-primary/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Select
            value={currentMonthValue}
            onValueChange={onMonthSelect}
          >
            <SelectTrigger className="min-w-[180px] bg-white/80 border-primary/20 hover:border-primary/50 focus:border-primary">
              <SelectValue placeholder={format(currentDate, 'MMMM yyyy')} />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm">
              {monthOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            aria-label="Next month"
            className="bg-white/80 hover:bg-primary/10 hover:text-primary border-primary/20"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Tabs 
            value={viewType} 
            onValueChange={(value) => onViewChange(value as CalendarViewType)} 
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2 sm:w-auto bg-white/80">
              <TabsTrigger value="month" className="data-[state=active]:bg-primary data-[state=active]:text-white">Month</TabsTrigger>
              <TabsTrigger value="week" className="data-[state=active]:bg-primary data-[state=active]:text-white">Week</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select
            value={filterType}
            onValueChange={(value) => onFilterChange(value as CalendarFilterType)}
          >
            <SelectTrigger className="w-[130px] bg-white/80 border-primary/20 hover:border-primary/50">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm">
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="recurring">Recurring</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
