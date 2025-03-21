
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InvoiceDetails, PaymentSummary } from "@/types/invoice";
import { 
  CreditCard, 
  Building, 
  Banknote, 
  CheckCircle, 
  Star, 
  ChevronDown, 
  ChevronUp,
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PaymentMethodStepProps {
  invoiceDetails: InvoiceDetails;
  onSelect: (methodId: string) => void;
  onBack: () => void;
}

interface PaymentMethodOption {
  id: string;
  type: 'card' | 'bank' | 'bnpl' | 'rewards';
  name: string;
  description: string;
  icon: React.ElementType;
  details?: string;
  isEligible: boolean;
  ineligibleReason?: string;
  rewardMultiplier?: number;
}

const PaymentMethodStep = ({ 
  invoiceDetails, 
  onSelect, 
  onBack 
}: PaymentMethodStepProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary>({
    invoiceAmount: invoiceDetails.totalAmount,
    platformFee: 0,
    processingFee: 0,
    gstOnFees: 0,
    totalPayable: invoiceDetails.totalAmount,
    rewardPointsEarned: 0
  });
  
  // Mock payment methods data
  const paymentMethods: PaymentMethodOption[] = [
    {
      id: 'card-1',
      type: 'card',
      name: 'HDFC Business Credit Card',
      description: 'Earn 2x reward points',
      icon: CreditCard,
      details: '**** **** **** 4389',
      isEligible: true,
      rewardMultiplier: 2
    },
    {
      id: 'bank-1',
      type: 'bank',
      name: 'HDFC Bank Account',
      description: 'Direct bank transfer (NEFT/RTGS)',
      icon: Building,
      details: 'HDFC **** 7890',
      isEligible: true
    },
    {
      id: 'bnpl-1',
      type: 'bnpl',
      name: 'Pay Later',
      description: 'Pay in 30 days, no interest',
      icon: Banknote,
      isEligible: invoiceDetails.totalAmount <= 50000,
      ineligibleReason: 'Amount exceeds credit limit of ₹50,000'
    },
    {
      id: 'rewards-1',
      type: 'rewards',
      name: 'Reward Points',
      description: 'Use available reward points',
      icon: Star,
      details: '2,500 points available (₹2,500)',
      isEligible: false,
      ineligibleReason: 'Insufficient reward points'
    }
  ];
  
  // Update payment summary based on selected method
  useEffect(() => {
    if (!selectedMethod) {
      setPaymentSummary({
        invoiceAmount: invoiceDetails.totalAmount,
        platformFee: 0,
        processingFee: 0,
        gstOnFees: 0,
        totalPayable: invoiceDetails.totalAmount,
        rewardPointsEarned: 0
      });
      return;
    }
    
    const selectedOption = paymentMethods.find(m => m.id === selectedMethod);
    
    if (!selectedOption) return;
    
    let platformFee = invoiceDetails.totalAmount * 0.005; // 0.5%
    let processingFee = 0;
    let rewardPoints = 0;
    
    // Calculate fees based on payment method type
    if (selectedOption.type === 'card') {
      processingFee = invoiceDetails.totalAmount * 0.02; // 2%
      rewardPoints = Math.floor(invoiceDetails.totalAmount * 0.01); // 1 point per 100 rupees
      
      if (selectedOption.rewardMultiplier) {
        rewardPoints *= selectedOption.rewardMultiplier;
      }
    } else if (selectedOption.type === 'bank') {
      processingFee = 0; // No processing fee for bank transfers
    } else if (selectedOption.type === 'bnpl') {
      processingFee = invoiceDetails.totalAmount * 0.015; // 1.5%
    }
    
    // Calculate GST on fees (18%)
    const gstOnFees = (platformFee + processingFee) * 0.18;
    
    // Calculate total payable
    const totalPayable = invoiceDetails.totalAmount + platformFee + processingFee + gstOnFees;
    
    setPaymentSummary({
      invoiceAmount: invoiceDetails.totalAmount,
      platformFee,
      processingFee,
      gstOnFees,
      totalPayable,
      rewardPointsEarned: rewardPoints
    });
    
  }, [selectedMethod, invoiceDetails.totalAmount, paymentMethods]);
  
  const handleMethodSelect = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    
    if (!method || !method.isEligible) {
      toast.error(`This payment method is not eligible: ${method?.ineligibleReason}`);
      return;
    }
    
    setSelectedMethod(methodId);
  };
  
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Select Payment Method</h2>
        <p className="text-muted-foreground">
          Choose how you want to pay {invoiceDetails.vendorName}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`
                flex items-center p-4 border rounded-md cursor-pointer transition-all
                ${selectedMethod === method.id ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50'}
                ${!method.isEligible ? 'opacity-60 cursor-not-allowed' : ''}
              `}
              onClick={() => method.isEligible && handleMethodSelect(method.id)}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${selectedMethod === method.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
                  `}>
                    <method.icon className="h-5 w-5" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{method.name}</p>
                      {!method.isEligible && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                  Not Eligible
                                </Badge>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{method.ineligibleReason}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    {method.details && (
                      <p className="text-xs text-muted-foreground mt-1">{method.details}</p>
                    )}
                  </div>
                </div>
                
                {selectedMethod === method.id && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Payment Summary</h3>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Amount:</span>
                  <span>{formatCurrency(paymentSummary.invoiceAmount)}</span>
                </div>
                
                <Accordion
                  type="single"
                  collapsible
                  value={expanded ? "fees" : ""}
                  onValueChange={(value) => setExpanded(value === "fees")}
                  className="border-t border-border pt-2"
                >
                  <AccordionItem value="fees" className="border-none">
                    <AccordionTrigger className="p-0 hover:no-underline">
                      <span className="text-muted-foreground mr-1">Fees</span>
                      {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-0 px-0">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Platform Fee (0.5%):</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Standard platform fee for all transactions</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <span>{formatCurrency(paymentSummary.platformFee)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Processing Fee:</span>
                          <span>{formatCurrency(paymentSummary.processingFee)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">GST on Fees (18%):</span>
                          <span>{formatCurrency(paymentSummary.gstOnFees)}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="flex justify-between font-medium pt-3 border-t">
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
        >
          Back
        </Button>
        <Button 
          onClick={() => selectedMethod && onSelect(selectedMethod)}
          disabled={!selectedMethod}
          className="flex-1"
        >
          Proceed to Pay
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodStep;
