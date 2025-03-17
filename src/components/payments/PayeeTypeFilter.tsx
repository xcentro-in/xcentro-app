
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PayeeType } from "@/types/payee";
import { getPayeeTypeLabel } from "@/utils/payeeUtils";

interface PayeeTypeFilterProps {
  filterType: PayeeType | "all";
  setFilterType: (type: PayeeType | "all") => void;
}

const PayeeTypeFilter = ({ filterType, setFilterType }: PayeeTypeFilterProps) => {
  return (
    <Select value={filterType} onValueChange={(val) => setFilterType(val as PayeeType | "all")}>
      <SelectTrigger className="w-[180px]">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by type" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        <SelectItem value="bank">{getPayeeTypeLabel("bank")}</SelectItem>
        <SelectItem value="biller">{getPayeeTypeLabel("biller")}</SelectItem>
        <SelectItem value="payroll">{getPayeeTypeLabel("payroll")}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PayeeTypeFilter;
