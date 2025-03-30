
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Upload } from "lucide-react";
import PaymentMethodSelector from "./PaymentMethodSelector";
import UploadBillTab from "./credit-card-bill/UploadBillTab";
import QuickPayTab from "./credit-card-bill/QuickPayTab";
import BillDetailsCard from "./credit-card-bill/BillDetailsCard";
import PaymentReviewCard from "./credit-card-bill/PaymentReviewCard";

interface CreditCardBillPaymentFormProps {
  onStepChange: (step: number) => void;
  initialMethod?: "upload" | "quick";
}

export default function CreditCardBillPaymentForm({ 
  onStepChange, 
  initialMethod = "upload" 
}: CreditCardBillPaymentFormProps) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<"upload" | "quick">(initialMethod);
  const [cardDetails, setCardDetails] = useState({
    cardIssuer: "",
    lastFourDigits: "",
    dueDate: "",
    totalDue: "",
    minimumDue: "",
  });
  
  useEffect(() => {
    onStepChange(step);
  }, [step, onStepChange]);
  
  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
  };
  
  const handleUploadSuccess = (extractedData: any) => {
    setCardDetails(extractedData);
    setAmount(extractedData.totalDue);
    setStep(2);
  };
  
  const handleQuickPayContinue = (amount: string, cardDetails: any) => {
    setAmount(amount);
    setCardDetails(cardDetails);
    setStep(2);
  };
  
  const handleNext = () => {
    const nextStep = step + 1;
    setStep(nextStep);
  };
  
  const handleBack = () => {
    const prevStep = step - 1;
    setStep(prevStep);
  };
  
  return (
    <div className="space-y-6">
      {step === 1 && (
        <>
          <h3 className="font-medium mb-4">Credit Card Bill Payment</h3>
          
          <Tabs 
            defaultValue={initialMethod} 
            value={selectedMethod}
            onValueChange={(value) => setSelectedMethod(value as "upload" | "quick")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" /> Upload Bill
              </TabsTrigger>
              <TabsTrigger value="quick" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Quick Pay
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4 mt-4">
              <UploadBillTab 
                onUpload={handleUploadSuccess} 
                onUseQuickPay={() => setSelectedMethod("quick")} 
              />
            </TabsContent>
            
            <TabsContent value="quick" className="space-y-4 mt-4">
              <QuickPayTab onContinue={handleQuickPayContinue} />
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {step === 2 && (
        <>
          <h3 className="font-medium mb-4">Select Payment Method</h3>
          
          {selectedMethod === "upload" && (
            <BillDetailsCard 
              cardDetails={cardDetails} 
              amount={amount} 
              onAmountChange={handleAmountChange} 
            />
          )}
          
          <PaymentMethodSelector
            selectedMethodId={paymentMethod}
            onSelect={setPaymentMethod}
          />
          
          <div className="flex justify-between gap-3 mt-6">
            <Button variant="outline" onClick={handleBack} className="w-auto">
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              className="w-auto"
              disabled={!paymentMethod}
            >
              Review Payment
            </Button>
          </div>
        </>
      )}
      
      {step === 3 && (
        <>
          <h3 className="font-medium text-lg mb-6">Review Credit Card Bill Payment</h3>
          
          <PaymentReviewCard cardDetails={cardDetails} amount={amount} />
          
          <div className="flex justify-between gap-3">
            <Button variant="outline" onClick={handleBack} className="w-auto">
              Back
            </Button>
            <Button className="w-auto">Confirm Payment</Button>
          </div>
        </>
      )}
    </div>
  );
}
