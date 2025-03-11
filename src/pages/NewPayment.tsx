
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import SinglePaymentForm from "@/components/payments/SinglePaymentForm";
import BatchPaymentForm from "@/components/payments/BatchPaymentForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const steps = {
  single: ["Details", "Payee", "Payment Method", "Review"],
  batch: ["Upload", "Validate", "Payment Method", "Review"],
};

const NewPayment = () => {
  const [activeTab, setActiveTab] = useState("single");
  const [step, setStep] = useState(1);

  const totalSteps = steps[activeTab as keyof typeof steps].length;
  const progress = (step / totalSteps) * 100;

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
          <div className="mb-8 space-y-2">
            <div className="flex justify-between text-sm mb-2">
              <div className="space-y-1">
                <p className="font-medium">
                  Step {step} of {totalSteps}: {steps[activeTab as keyof typeof steps][step - 1]}
                </p>
              </div>
              <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Payment</TabsTrigger>
              <TabsTrigger value="batch">Batch Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="mt-4">
              <SinglePaymentForm onStepChange={setStep} />
            </TabsContent>

            <TabsContent value="batch" className="mt-4">
              <BatchPaymentForm onStepChange={setStep} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPayment;
