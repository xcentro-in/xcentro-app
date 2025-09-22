
import { Card } from "@/components/ui/card";

// Import new components and hooks
import PaymentsHeader from "@/components/payments/shared/ui/PaymentsHeader";
import PaymentsTableContainer from "@/components/payments/payment-history/tables/PaymentsTableContainer";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useEffect } from "react";

const Payments = () => {
  const { setTitle } = usePageTitle();
  
  useEffect(() => {
    setTitle("Payment History");
  }, [setTitle]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PaymentsHeader />

      <Card className="animate-scale-in">
        {/* Self-contained table that uses usePaymentHistory hook */}
        <PaymentsTableContainer />
      </Card>
    </div>
  );
};

export default Payments;
