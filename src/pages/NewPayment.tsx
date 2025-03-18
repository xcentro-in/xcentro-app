
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import SinglePaymentForm from "@/components/payments/SinglePaymentForm";
import BatchPaymentForm from "@/components/payments/BatchPaymentForm";
import GSTPaymentForm from "@/components/payments/GSTPaymentForm";
import CreditCardBillPaymentForm from "@/components/payments/CreditCardBillPaymentForm";
import PaymentCategorySelection from "@/components/payments/PaymentCategorySelection";

type PaymentCategory = "selection" | "single" | "batch" | "gst" | "creditcard";

const steps = {
  single: ["Details", "Payee", "Payment Method", "Review"],
  batch: ["Upload", "Validate", "Payment Method", "Review"],
  gst: ["Upload/Details", "Payment Method", "Review"],
  creditcard: ["Bill Upload/Details", "Payment Method", "Review"],
};

const NewPayment = () => {
  const [step, setStep] = useState(0);
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>("selection");

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
  const totalSteps = paymentCategory !== "selection" ? steps[paymentCategory as keyof typeof steps].length : 1;
  const progress = (step / totalSteps) * 100;
  const currentSteps = paymentCategory !== "selection" ? steps[paymentCategory as keyof typeof steps] : ["Category Selection"];

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
              {paymentCategory === "creditcard" && <CreditCardBillPaymentForm onStepChange={setStep} />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPayment;
