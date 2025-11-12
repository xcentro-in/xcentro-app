import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PaymentProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentPopup, setPaymentPopup] = useState<Window | null>(null);
  const popupCheckIntervalRef = useRef<number | null>(null);

  // Get redirect URL from navigation state
  const redirectUrl = location.state?.redirectUrl as string | undefined;

  // Cleanup popup interval on unmount
  useEffect(() => {
    return () => {
      if (popupCheckIntervalRef.current) {
        clearInterval(popupCheckIntervalRef.current);
      }
    };
  }, []);

  // Open payment popup when component mounts
  useEffect(() => {
    if (redirectUrl) {
      openPaymentPopup(redirectUrl);
    }
  }, [redirectUrl]);

  // Open payment redirect popup
  const openPaymentPopup = (url: string) => {
    const popup = window.open(url, "payment-verification", "width=800,height=600,scrollbars=yes");

    // Check if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      toast.error("Popup was blocked. Please enable popups for this site and try again.");
      navigate('/payments');
      return;
    }

    setPaymentPopup(popup);

    // Monitor popup closure and redirect to payment history when closed
    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        setPaymentPopup(null);
        popupCheckIntervalRef.current = null;

        console.log('Payment popup closed, redirecting to payment history...');

        // Redirect to payment history page
        toast.success("Payment processing complete! Redirecting to payment history...");
        navigate('/payments');
      }
    }, 1000);

    popupCheckIntervalRef.current = checkPopupClosed as unknown as number;
  };

  // If no redirect URL, show error state
  if (!redirectUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">No Payment in Progress</h2>
            <p className="text-muted-foreground">
              There is no active payment to process.
            </p>
          </div>
          <Button onClick={() => navigate('/payments')}>
            Go to Payment History
          </Button>
        </div>
      </div>
    );
  }

  // Show payment processing spinner
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Processing Payment</h3>
          <p className="text-muted-foreground">Getting payment info...</p>
          <p className="text-sm text-muted-foreground">
            Please complete the payment verification in the popup window
          </p>
          <p className="text-sm font-medium text-orange-600">
            Please don't refresh while transaction is in progress
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
