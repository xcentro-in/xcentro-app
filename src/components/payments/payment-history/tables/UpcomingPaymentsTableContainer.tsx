import { CardContent } from "@/components/ui/card";
import UpcomingPaymentsTable from "./UpcomingPaymentsTable";

interface UpcomingPaymentsTableContainerProps {
  // No props needed - table is now self-contained
}

const UpcomingPaymentsTableContainer = ({}: UpcomingPaymentsTableContainerProps) => {
  return (
    <CardContent className="p-6">
      <UpcomingPaymentsTable />
    </CardContent>
  );
};

export default UpcomingPaymentsTableContainer;