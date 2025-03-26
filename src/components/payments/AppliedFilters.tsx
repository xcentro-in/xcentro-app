import { Info, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export interface ActiveFilter {
  type: string;
  value: string;
  label: string;
}
interface AppliedFiltersProps {
  activeFilters: ActiveFilter[];
  dateRange?: DateRange;
  onRemoveFilter: (filter: ActiveFilter) => void;
  onResetFilters: () => void;
}
const AppliedFilters = ({
  activeFilters,
  dateRange,
  onRemoveFilter,
  onResetFilters
}: AppliedFiltersProps) => {
  return;
};
export default AppliedFilters;