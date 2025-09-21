
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePageTitle } from "@/contexts/PageTitleContext";
import SinglePaymentForm from "@/components/payments/quick-pay/SinglePaymentForm";
import BatchPaymentForm from "@/components/payments/BatchPaymentForm";
import GSTPaymentForm from "@/components/payments/GSTPaymentForm";
import CreditCardBillPaymentForm from "@/components/payments/CreditCardBillPaymentForm";
import PayrollPaymentForm from "@/components/payments/PayrollPaymentForm";
import PaymentCategorySelection from "@/components/payments/PaymentCategorySelection";
import InvoicePaymentForm from "@/components/payments/InvoicePaymentForm";
import { useLocation, useNavigate } from "react-router-dom";

type PaymentCategory = "selection" | "single" | "batch" | "gst" | "creditcard" | "payroll" | "invoice";

const steps = {
  single: ["Details & Payee", "Payment Method & Review"],
  batch: ["Upload/Import", "Validate", "Payment Method & Review"],
  gst: ["Upload/Details", "Payment method", "Reward Top-Up", "Review"],
  creditcard: ["Bill Upload/Details", "Payment method", "Reward Top-Up", "Review"],
  payroll: ["Employee Selection", "Payment Method & Review"],
  invoice: ["Invoice Selection", "Payment Method & Review"]
};

const paymentTitles = {
  selection: "New Payment",
  single: "Quick Payment",
  batch: "Batch Payment",
  gst: "GST Payment",
  creditcard: "Credit Card Bill Payment",
  payroll: "Payroll Payment",
  invoice: "Pay Invoice"
};

const paymentSubtitles = {
  selection: "Create a new payment transaction",
  single: "Make quick payments to your vendor",
  batch: "Pay multiple vendors at once",
  gst: "Pay your GST taxes",
  creditcard: "Pay your credit card bills",
  payroll: "Process payroll for your employees",
  invoice: "Select and pay multiple vendor invoices"
};

const NewPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();
  const locationState = location.state as {
    paymentCategory?: PaymentCategory;
    paymentMethod?: string;
  } | null;

  const [step, setStep] = useState(0);
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>(locationState?.paymentCategory || "selection");
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(locationState?.paymentMethod);

  // Set initial state based on location state
  useEffect(() => {
    if (locationState?.paymentCategory) {
      setPaymentCategory(locationState.paymentCategory);
      setStep(1);
    }
  }, [locationState]);

  // Update page title when category changes
  useEffect(() => {
    setTitle(paymentTitles[paymentCategory]);
    
    // Clean up title when component unmounts
    return () => {
      setTitle('');
    };
  }, [paymentCategory, setTitle]);

  const handleCategorySelect = (category: PaymentCategory) => {
    setPaymentCategory(category);
    setStep(1);
  };

  // Reset to category selection
  const handleReset = () => {
    setPaymentCategory("selection");
    setStep(0);
  };

  // Only calculate progress if we've selected a category
  const currentSteps = paymentCategory !== "selection" ? steps[paymentCategory] : ["Category Selection"];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        {paymentCategory !== "selection" && (
          <Button 
            variant="ghost" 
            className="w-fit pl-0 hover:pl-0 hover:bg-transparent -ml-2 text-muted-foreground"
            onClick={handleReset}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Change payment type
          </Button>
        )}
        
        <div className="flex flex-col">
          <p className="text-muted-foreground animate-slide-up" style={{
            animationDelay: "50ms"
          }}>
            {paymentSubtitles[paymentCategory]}
          </p>
        </div>
      </div>

      <Card className="animate-scale-in">
        <CardContent className="pt-6">
          {paymentCategory !== "selection" && (
            <div className="mb-8">
              <Progress 
                showMilestones={true} 
                milestones={currentSteps} 
                currentStep={step} 
              />
            </div>
          )}

          {paymentCategory === "selection" ? (
            <PaymentCategorySelection onSelect={handleCategorySelect} />
          ) : (
            <>
              {paymentCategory === "single" && <SinglePaymentForm onStepChange={setStep} />}
              {paymentCategory === "batch" && <BatchPaymentForm onStepChange={setStep} />}
              {paymentCategory === "gst" && <GSTPaymentForm onStepChange={setStep} />}
              {paymentCategory === "creditcard" && <CreditCardBillPaymentForm onStepChange={setStep} initialMethod={paymentMethod === "quick" ? "quick" : "upload"} />}
              {paymentCategory === "payroll" && <PayrollPaymentForm onStepChange={setStep} />}
              {paymentCategory === "invoice" && <InvoicePaymentForm onStepChange={setStep} />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPayment;
