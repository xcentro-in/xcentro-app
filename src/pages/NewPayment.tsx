
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
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
  single: ["Details", "Payee", "Payment Method", "Review"],
  batch: ["Upload", "Validate", "Payment Method", "Review"],
  gst: ["Upload/Details", "Payment Method", "Review"],
  creditcard: ["Bill Upload/Details", "Payment Method", "Review"],
  payroll: ["Entry Method", "Details/Selection", "Review"],
  invoice: ["Upload Invoice", "Review Details", "Payment Method", "Confirmation"],
};

const NewPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { 
    paymentCategory?: PaymentCategory;
    paymentMethod?: string; 
  } | null;

  const [step, setStep] = useState(0);
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>(
    locationState?.paymentCategory || "selection"
  );
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(
    locationState?.paymentMethod
  );

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
  const totalSteps = paymentCategory !== "selection" ? steps[paymentCategory].length : 1;
  const progress = (step / totalSteps) * 100;
  const currentSteps = paymentCategory !== "selection" ? steps[paymentCategory] : ["Category Selection"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">New Payment</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Create a new payment transaction
        </p>
      </div>

      <Card className="animate-scale-in">
        <CardContent className="pt-6">
          {paymentCategory !== "selection" && (
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <button 
                  onClick={handleReset} 
                  className="text-primary text-sm hover:underline"
                >
                  ← Change payment type
                </button>
                <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2" 
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
              {paymentCategory === "creditcard" && (
                <CreditCardBillPaymentForm 
                  onStepChange={setStep} 
                  initialMethod={paymentMethod === "quick" ? "quick" : "upload"}
                />
              )}
              {paymentCategory === "payroll" && <PayrollPaymentForm onStepChange={setStep} />}
              {paymentCategory === "invoice" && <PayInvoice />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPayment;
