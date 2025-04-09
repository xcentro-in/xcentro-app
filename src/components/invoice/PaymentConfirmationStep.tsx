
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InvoiceDetails, PaymentSummary } from "@/types/invoice";
import { 
  CheckCircle2, 
  CreditCard, 
  Building, 
  Banknote, 
  Star, 
  FileText, 
  Download, 
  Printer,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {formatCurrency} from "@/utils/formatters"

interface PaymentConfirmationStepProps {
  invoiceDetails: InvoiceDetails;
  paymentMethodId: string;
  onConfirm: () => void;
  onBack: () => void;
}

const PaymentConfirmationStep = ({ 
  invoiceDetails, 
  paymentMethodId,
  onConfirm, 
  onBack 
}: PaymentConfirmationStepProps) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary>({
    invoiceAmount: invoiceDetails.totalAmount,
    platformFee: invoiceDetails.totalAmount * 0.005,
    processingFee: paymentMethodId.startsWith('card') ? invoiceDetails.totalAmount * 0.02 : 0,
    gstOnFees: (invoiceDetails.totalAmount * 0.005 + (paymentMethodId.startsWith('card') ? invoiceDetails.totalAmount * 0.02 : 0)) * 0.18,
    totalPayable: 0,
    rewardPointsEarned: paymentMethodId.startsWith('card') ? Math.floor(invoiceDetails.totalAmount * 0.02) : 0
  });
  
  useEffect(() => {
    // Calculate total payable
    const totalPayable = paymentSummary.invoiceAmount + 
                          paymentSummary.platformFee + 
                          paymentSummary.processingFee + 
                          paymentSummary.gstOnFees;
    
    setPaymentSummary(prev => ({
      ...prev,
      totalPayable
    }));
  }, []);
  
  const getPaymentMethodDetails = () => {
    if (paymentMethodId.startsWith('card')) {
      return {
        name: 'HDFC Business Credit Card',
        details: '**** **** **** 4389',
        icon: CreditCard
      };
    } else if (paymentMethodId.startsWith('bank')) {
      return {
        name: 'HDFC Bank Account',
        details: 'HDFC **** 7890',
        icon: Building
      };
    } else if (paymentMethodId.startsWith('bnpl')) {
      return {
        name: 'Pay Later',
        details: 'Due in 30 days',
        icon: Banknote
      };
    } else {
      return {
        name: 'Reward Points',
        details: '2,500 points',
        icon: Star
      };
    }
  };
  
  const handleConfirmPayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      toast.success("Payment processed successfully");
    }, 3000);
  };
  
  const paymentMethod = getPaymentMethodDetails();
  const PaymentIcon = paymentMethod.icon;
  
  if (isCompleted) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-center">Payment Successful</h2>
          <p className="text-center text-muted-foreground mt-2">
            Your payment to {invoiceDetails.vendorName} has been processed successfully
          </p>
          <p className="text-center font-medium mt-4">
            Transaction ID: TX-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Invoice Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Number:</span>
                  <span>{invoiceDetails.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor:</span>
                  <span>{invoiceDetails.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-medium">{formatCurrency(paymentSummary.totalPayable)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>{paymentMethod.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Receipt Options</h3>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="w-full flex justify-between" onClick={() => toast.info("Receipt download feature coming soon")}>
                    <span className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Receipt
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full flex justify-between" onClick={() => toast.info("Print receipt feature coming soon")}>
                    <span className="flex items-center gap-2">
                      <Printer className="h-4 w-4" />
                      Print Receipt
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full flex justify-between" onClick={() => toast.info("View invoice feature coming soon")}>
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      View Original Invoice
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {paymentSummary.rewardPointsEarned ? (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Star className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">You've earned {paymentSummary.rewardPointsEarned} reward points!</h3>
                      <p className="text-sm text-green-700">Check your rewards dashboard to redeem.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
        
        <div className="pt-4 flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/payments')}
            className="flex-1"
          >
            View All Payments
          </Button>
          <Button 
            onClick={() => navigate('/pay-invoice')}
            className="flex-1"
          >
            Pay Another Invoice
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Payment Confirmation</h2>
        <p className="text-muted-foreground">
          Review and confirm your payment details
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Invoice Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Number:</span>
                  <span>{invoiceDetails.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor:</span>
                  <span>{invoiceDetails.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Date:</span>
                  <span>{new Date(invoiceDetails.invoiceDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{new Date(invoiceDetails.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Payment Method</h3>
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  bg-primary/10 text-primary
                `}>
                  <PaymentIcon className="h-5 w-5" />
                </div>
                
                <div>
                  <p className="font-medium">{paymentMethod.name}</p>
                  <p className="text-sm text-muted-foreground">{paymentMethod.details}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Payment Summary</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Amount:</span>
                  <span>{formatCurrency(paymentSummary.invoiceAmount)}</span>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee:</span>
                    <span>{formatCurrency(paymentSummary.platformFee)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing Fee:</span>
                    <span>{formatCurrency(paymentSummary.processingFee)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%):</span>
                    <span>{formatCurrency(paymentSummary.gstOnFees)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total Payable:</span>
                  <span>{formatCurrency(paymentSummary.totalPayable)}</span>
                </div>
                
                {paymentSummary.rewardPointsEarned ? (
                  <div className="flex justify-between text-green-600 text-xs pt-2">
                    <span>Reward Points to be Earned:</span>
                    <span>{paymentSummary.rewardPointsEarned} points</span>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="pt-4 flex gap-3">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1"
          disabled={isProcessing}
        >
          Back
        </Button>
        <Button 
          onClick={handleConfirmPayment}
          disabled={isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Processing Payment...
            </div>
          ) : 'Confirm & Pay'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentConfirmationStep;
