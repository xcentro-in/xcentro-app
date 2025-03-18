
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Upload, AlertTriangle } from "lucide-react";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { mockCreditCardBills } from "@/data/mockCreditCardBills";

interface CreditCardBillPaymentFormProps {
  onStepChange: (step: number) => void;
}

export default function CreditCardBillPaymentForm({ onStepChange }: CreditCardBillPaymentFormProps) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<"upload" | "quick">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardIssuer: "",
    lastFourDigits: "",
    dueDate: "",
    totalDue: "",
    minimumDue: "",
  });
  const [paymentType, setPaymentType] = useState<"full" | "minimum" | "custom">("full");
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");
    if (value === "" || (/^\d*\.?\d{0,2}$/).test(value)) {
      setAmount(value);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      setIsUploading(false);
      // Sample extracted data
      const extractedData = {
        cardIssuer: "HDFC Bank",
        lastFourDigits: "1234",
        dueDate: "2024-04-15",
        totalDue: "50000",
        minimumDue: "5000",
      };
      
      setCardDetails(extractedData);
      setAmount(extractedData.totalDue);
      setStep(2);
      onStepChange(2);
    }, 2000);
  };
  
  const handleNext = () => {
    const nextStep = step + 1;
    setStep(nextStep);
    onStepChange(nextStep);
  };
  
  const handleBack = () => {
    const prevStep = step - 1;
    setStep(prevStep);
    onStepChange(prevStep);
  };
  
  const handlePaymentTypeChange = (value: string) => {
    const type = value as "full" | "minimum" | "custom";
    setPaymentType(type);
    
    if (type === "full" && cardDetails.totalDue) {
      setAmount(cardDetails.totalDue);
    } else if (type === "minimum" && cardDetails.minimumDue) {
      setAmount(cardDetails.minimumDue);
    }
  };
  
  return (
    <div className="space-y-6">
      {step === 1 && (
        <>
          <h3 className="font-medium mb-4">Credit Card Bill Payment</h3>
          
          <Tabs 
            defaultValue="upload" 
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
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-4">
                    Upload your credit card statement to automatically extract payment details
                  </div>
                  
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    
                    <div className="flex flex-col items-center space-y-2">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      
                      {selectedFile ? (
                        <>
                          <p className="text-green-600 font-medium">File selected: {selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">Click upload button below to process</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">Drag & drop your credit card bill PDF here</p>
                          <p className="text-sm text-muted-foreground">
                            or <Button variant="link" className="p-0 h-auto" onClick={() => document.getElementById("file-upload")?.click()}>browse files</Button>
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedMethod("quick");
                      }}
                    >
                      Use Quick Pay Instead
                    </Button>
                    
                    <Button 
                      onClick={handleUpload}
                      disabled={!selectedFile || isUploading}
                    >
                      {isUploading ? "Processing..." : "Upload & Extract Data"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quick" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="creditCard">Select Credit Card</Label>
                      <div className="mt-2">
                        <PaymentMethodSelector
                          onSelect={(id) => {
                            // Find the selected method from the mock data
                            const cardBill = mockCreditCardBills.find(bill => bill.id === "ccb-001");
                            if (cardBill) {
                              setCardDetails({
                                cardIssuer: cardBill.cardIssuer,
                                lastFourDigits: cardBill.lastFourDigits,
                                dueDate: cardBill.dueDate,
                                totalDue: cardBill.totalDueAmount.toString(),
                                minimumDue: cardBill.minimumDueAmount.toString(),
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="amount">Payment Amount (₹)</Label>
                      <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-muted-foreground">₹</span>
                        </div>
                        <Input
                          id="amount"
                          type="text"
                          value={amount}
                          onChange={handleAmountChange}
                          className="pl-8"
                          placeholder="Enter amount"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 mt-6 bg-amber-50 rounded-md text-amber-800">
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Pay with caution</p>
                      <p>Without uploading the bill, we can't verify due dates or minimum payments.</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleNext}
                      disabled={!amount || parseFloat(amount) <= 0}
                    >
                      Continue to Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {step === 2 && (
        <>
          <h3 className="font-medium mb-4">Select Payment Method</h3>
          
          {selectedMethod === "upload" && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Extracted Bill Details</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Card Issuer</p>
                    <p className="font-medium">{cardDetails.cardIssuer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Card Number</p>
                    <p className="font-medium">**** {cardDetails.lastFourDigits}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">{new Date(cardDetails.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount Due</p>
                    <p className="font-medium">₹{parseInt(cardDetails.totalDue).toLocaleString()}</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <h4 className="font-medium mb-3">Select Payment Amount</h4>
                <RadioGroup 
                  value={paymentType} 
                  onValueChange={handlePaymentTypeChange}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="payment-full" />
                    <Label htmlFor="payment-full" className="flex-1">
                      Pay Full Amount
                      <span className="block text-sm text-muted-foreground mt-0.5">
                        ₹{parseInt(cardDetails.totalDue).toLocaleString()}
                      </span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimum" id="payment-minimum" />
                    <Label htmlFor="payment-minimum" className="flex-1">
                      Pay Minimum Due
                      <span className="block text-sm text-muted-foreground mt-0.5">
                        ₹{parseInt(cardDetails.minimumDue).toLocaleString()}
                      </span>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="custom" id="payment-custom" className="mt-2.5" />
                    <div className="flex-1">
                      <Label htmlFor="payment-custom">Custom Amount</Label>
                      <div className="relative mt-1.5">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-muted-foreground">₹</span>
                        </div>
                        <Input
                          id="custom-amount"
                          type="text"
                          value={amount}
                          onChange={handleAmountChange}
                          onClick={() => setPaymentType("custom")}
                          className="pl-8"
                          placeholder="Enter custom amount"
                        />
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}
          
          <PaymentMethodSelector
            selectedMethodId={paymentMethod}
            onSelect={setPaymentMethod}
          />
          
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              className="flex-1"
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
          
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">PAYMENT DETAILS</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Card Issuer</p>
                      <p className="font-medium">{cardDetails.cardIssuer || "Selected Card"}</p>
                    </div>
                    {cardDetails.lastFourDigits && (
                      <div>
                        <p className="text-sm text-muted-foreground">Card Number</p>
                        <p className="font-medium">**** {cardDetails.lastFourDigits}</p>
                      </div>
                    )}
                    {cardDetails.dueDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="font-medium">{new Date(cardDetails.dueDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">PAYMENT AMOUNT</h4>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bill Amount</span>
                      <span className="font-medium">₹{parseInt(amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing Fee (0.5%)</span>
                      <span>₹{(parseInt(amount) * 0.005).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gateway Fee</span>
                      <span>₹50.00</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between font-medium">
                      <span>Total Payable</span>
                      <span>₹{(parseInt(amount) + parseInt(amount) * 0.005 + 50).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
            <Button className="flex-1">Confirm Payment</Button>
          </div>
        </>
      )}
    </div>
  );
}
