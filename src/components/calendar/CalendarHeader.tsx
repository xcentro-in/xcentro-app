
import React from "react";
import { ChevronLeft, ChevronRight, Download, Filter } from "lucide-react";
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
  onExport
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
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Select
            value={currentMonthValue}
            onValueChange={onMonthSelect}
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder={format(currentDate, 'MMMM yyyy')} />
            </SelectTrigger>
            <SelectContent>
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
            <TabsList className="grid w-full grid-cols-2 sm:w-auto">
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Select
              value={filterType}
              onValueChange={(value) => onFilterChange(value as CalendarFilterType)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onExport}
              title="Export Calendar"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
