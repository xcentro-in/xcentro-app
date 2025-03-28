
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InvoiceDetails, OCRProgress } from "@/types/invoice";
import UploadInvoiceStep from "@/components/invoice/UploadInvoiceStep";
import ReviewInvoiceStep from "@/components/invoice/ReviewInvoiceStep";
import PaymentMethodStep from "@/components/invoice/PaymentMethodStep";
import PaymentConfirmationStep from "@/components/invoice/PaymentConfirmationStep";

const PayInvoice = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState<OCRProgress>({ status: 'idle' });
  
  const handleUploadComplete = (file: File, details: InvoiceDetails) => {
    setInvoiceFile(file);
    setInvoiceDetails(details);
    setCurrentStep(2);
  };
  
  const handleDetailsConfirmed = (details: InvoiceDetails) => {
    setInvoiceDetails(details);
    setCurrentStep(3);
  };
  
  const handlePaymentMethodSelected = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setCurrentStep(4);
  };
  
  const handlePaymentConfirmed = () => {
    // Handle successful payment
    // This would typically redirect to a success page or back to Dashboard
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div>
      {currentStep === 1 && (
        <UploadInvoiceStep 
          onUploadComplete={handleUploadComplete} 
          ocrProgress={ocrProgress}
          setOcrProgress={setOcrProgress}
        />
      )}
      
      {currentStep === 2 && invoiceDetails && (
        <ReviewInvoiceStep 
          invoiceDetails={invoiceDetails} 
          onConfirm={handleDetailsConfirmed}
          onBack={handleBack}
          invoiceFile={invoiceFile}
        />
      )}
      
      {currentStep === 3 && invoiceDetails && (
        <PaymentMethodStep 
          invoiceDetails={invoiceDetails}
          onSelect={handlePaymentMethodSelected}
          onBack={handleBack}
        />
      )}
      
      {currentStep === 4 && invoiceDetails && selectedPaymentMethod && (
        <PaymentConfirmationStep 
          invoiceDetails={invoiceDetails}
          paymentMethodId={selectedPaymentMethod}
          onConfirm={handlePaymentConfirmed}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default PayInvoice;
