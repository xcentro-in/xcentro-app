
import { subDays, startOfQuarter } from "date-fns";
import { DateRange } from "react-day-picker";

export const getDateRangeFromFilter = (filter: string, currentDateRange?: DateRange): {
  dateRange: DateRange | undefined;
  showCustomDateRange: boolean;
} => {
  const today = new Date();
  let from: Date | undefined;
  let to: Date | undefined = today;
  let showDatePicker = false;

  switch (filter) {
    case "7days":
      from = subDays(today, 7);
      break;
    case "30days":
      from = subDays(today, 30);
      break;
    case "quarter":
      from = startOfQuarter(today);
      break;
    case "custom":
      showDatePicker = true;
      if (!currentDateRange?.from) {
        from = subDays(today, 7);
      } else {
        from = currentDateRange.from;
        to = currentDateRange.to || today;
      }
      break;
    case "all":
      from = undefined;
      to = undefined;
      break;
    default:
      from = subDays(today, 7);
  }

  return {
    dateRange: from || to ? { from, to } : undefined,
    showCustomDateRange: showDatePicker
  };
};
