import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PaymentProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentPopup, setPaymentPopup] = useState<Window | null>(null);
  const popupCheckIntervalRef = useRef<number | null>(null);

  // Get redirect URL and target from navigation state
  const redirectUrl = location.state?.redirectUrl as string | undefined;
  const redirectTarget = (location.state?.redirectTarget as string | undefined) || '/payments'; // Default to payments page
  const flowType = (location.state?.flowType as string | undefined) || 'payment'; // 'payment' or 'tokenization'

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
      navigate(redirectTarget);
      return;
    }

    setPaymentPopup(popup);

    // Monitor popup closure and redirect when closed
    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        setPaymentPopup(null);
        popupCheckIntervalRef.current = null;

        const action = flowType === 'tokenization' ? 'Card verification' : 'Payment processing';
        console.log(`${action} popup closed, redirecting to ${redirectTarget}...`);

        // Redirect to the appropriate page based on flow type
        const successMessage = flowType === 'tokenization'
          ? "Card verification complete! Redirecting to wallet..."
          : "Payment processing complete! Redirecting to payment history...";
        toast.success(successMessage);
        navigate(redirectTarget);
      }
    }, 1000);

    popupCheckIntervalRef.current = checkPopupClosed as unknown as number;
  };

  // If no redirect URL, show error state
  if (!redirectUrl) {
    const errorTitle = flowType === 'tokenization' ? 'No Card Verification in Progress' : 'No Payment in Progress';
    const errorMessage = flowType === 'tokenization'
      ? 'There is no active card verification to process.'
      : 'There is no active payment to process.';
    const buttonText = flowType === 'tokenization' ? 'Go to Wallet' : 'Go to Payment History';

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{errorTitle}</h2>
            <p className="text-muted-foreground">
              {errorMessage}
            </p>
          </div>
          <Button onClick={() => navigate(redirectTarget)}>
            {buttonText}
          </Button>
        </div>
      </div>
    );
  }

  // Show processing spinner
  const processingTitle = flowType === 'tokenization' ? 'Verifying Card' : 'Processing Payment';
  const processingSubtitle = flowType === 'tokenization' ? 'Getting card info...' : 'Getting payment info...';
  const processingInstruction = flowType === 'tokenization'
    ? 'Please complete the card verification in the popup window'
    : 'Please complete the payment verification in the popup window';
  const warningMessage = flowType === 'tokenization'
    ? "Please don't refresh while verification is in progress"
    : "Please don't refresh while transaction is in progress";

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{processingTitle}</h3>
          <p className="text-muted-foreground">{processingSubtitle}</p>
          <p className="text-sm text-muted-foreground">
            {processingInstruction}
          </p>
          <p className="text-sm font-medium text-orange-600">
            {warningMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
