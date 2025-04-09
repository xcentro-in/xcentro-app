import React from "react";
import { ChevronLeft, ChevronRight, List, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMonthsOptions } from "@/utils/calendarUtils";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onMonthSelect: (value: string) => void;
  activeView: "list" | "calendar";
  onViewChange: (view: "list" | "calendar") => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevious,
  onNext,
  onMonthSelect,
  activeView,
  onViewChange
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

        <div className="flex border rounded-lg overflow-hidden">
          <Button 
            variant={activeView === "list" ? "default" : "ghost"}
            size="icon"
            className={`h-9 w-9 ${activeView === "list" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}`}
            onClick={() => onViewChange("list")}
            title="List View"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant={activeView === "calendar" ? "secondary" : "ghost"}
            size="icon"
            className={`h-9 w-9 ${activeView === "calendar" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}`}
            onClick={() => onViewChange("calendar")}
            title="Calendar View"
          >
            <CalendarDays className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;