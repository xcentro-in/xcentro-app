
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SinglePaymentForm from "@/components/payments/SinglePaymentForm";
import BatchPaymentForm from "@/components/payments/BatchPaymentForm";
import GSTPaymentForm from "@/components/payments/GSTPaymentForm";
import CreditCardBillPaymentForm from "@/components/payments/CreditCardBillPaymentForm";
import PayrollPaymentForm from "@/components/payments/PayrollPaymentForm";
import PaymentCategorySelection from "@/components/payments/PaymentCategorySelection";
import PayInvoice from "./PayInvoice";
import { useLocation, useNavigate } from "react-router-dom";

type PaymentCategory = "selection" | "single" | "batch" | "gst" | "creditcard" | "payroll" | "invoice";

const steps = {
  single: ["Details & Payee", "Payment Method & Review"],
  batch: ["Upload/Import", "Validate", "Payment Method & Review"],
  gst: ["Upload/Details", "Payment method", "Reward Top-Up", "Review"],
  creditcard: ["Bill Upload/Details", "Payment method", "Reward Top-Up", "Review"],
  payroll: ["Entry Method", "Details", "Payment method", "Reward Top-Up", "Review"],
  invoice: ["Upload Invoice", "Review Details", "Payment method", "Reward Top-Up", "Confirmation"]
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
  invoice: "Upload and pay vendor invoices"
};

const NewPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">
            {paymentTitles[paymentCategory]}
          </h1>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{
            animationDelay: "50ms"
          }}>
            {paymentSubtitles[paymentCategory]}
          </p>
        </div>
        
        {paymentCategory !== "selection" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset} 
            className="gap-2 animate-slide-down bg-lime-500 hover:bg-lime-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Change payment type
          </Button>
        )}
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
              {paymentCategory === "invoice" && <PayInvoice onStepChange={setStep} />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPayment;
