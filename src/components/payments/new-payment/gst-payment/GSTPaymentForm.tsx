
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Info } from "lucide-react";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { TransactionDetailCard } from "@/components/transactions/TransactionDetailCard";
import { Separator } from "@/components/ui/separator";
import { PaymentScheduleType } from "../shared/common/PaymentScheduleSelector";
import PaymentMethodSelectionStep from "../batch-payment/PaymentMethodSelectionStep";
import RewardTopUpStep, { RewardPackage } from "../shared/common/RewardTopUpStep";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GSTPaymentFormProps {
  onStepChange: (step: number) => void;
}

type GSTPaymentStep = 1 | 2 | 3 | 4;
type InputMethod = "upload" | "manual";

const GSTPaymentForm = ({ onStepChange }: GSTPaymentFormProps) => {
  const [step, setStep] = useState<GSTPaymentStep>(1);
  const [inputMethod, setInputMethod] = useState<InputMethod>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();
  const [selectedRewardPackage, setSelectedRewardPackage] = useState<RewardPackage | null>(null);
  
  // Payment schedule states
  const [paymentType, setPaymentType] = useState<PaymentScheduleType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [frequency, setFrequency] = useState<string>("monthly");
  
  // Mock data for OCR results
  const challanData = {
    taxpayer: {
      gstin: "27AABCU9603R1ZX",
      businessName: "Universal Traders Pvt Ltd",
      email: "accounts@universaltraders.com",
      mobile: "9988776655"
    },
    challan: {
      cpin: "21122022AMT542",
      generationDate: "Dec 21, 2022",
      expiryDate: "Jan 04, 2023"
    },
    taxes: {
      cgst: 3500,
      sgst: 3500,
      igst: 0,
      cess: 0,
      total: 7000
    },
    payment: {
      bankName: "Reserve Bank of India",
      beneficiaryName: "GST Payment Portal",
      ifsc: "RBIN0991276",
      accountNumber: "39789149139028493"
    },
    fees: {
      gstAmount: 7000,
      processingFeeGovt: 78,
      platformFee: 150,
      total: 7228
    }
  };

  // This function would be called when a user selects a file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleNext = () => {
    const nextStep = step + 1 as GSTPaymentStep;
    setStep(nextStep);
    onStepChange(nextStep);
  };

  const handleBack = () => {
    const prevStep = step - 1 as GSTPaymentStep;
    setStep(prevStep);
    onStepChange(prevStep);
  };

  const handleTabChange = (value: string) => {
    setInputMethod(value as InputMethod);
  };

  const handleRewardPackageSelected = (pkg: RewardPackage | null) => {
    setSelectedRewardPackage(pkg);
    handleNext();
  };

  // Get total tax amount based on the input method
  const getTaxAmount = () => {
    return inputMethod === "upload" ? challanData.taxes.total : parseFloat(taxAmount) || 0;
  };

  const getRewardPackageCost = () => {
    if (!selectedRewardPackage) return 0;
    return getTaxAmount() * (selectedRewardPackage.percentage / 100);
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="font-medium text-lg mb-2">GST Payment Details</h3>
          
          <Tabs defaultValue="upload" onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="upload" className="flex-1">Upload GST Challan</TabsTrigger>
              <TabsTrigger value="manual" className="flex-1">Add Details Manually</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-1">Upload GST Challan</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <input 
                  type="file" 
                  id="file-upload" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                {selectedFile ? (
                  <div className="text-sm bg-primary/10 text-primary p-2 rounded inline-block">
                    {selectedFile.name}
                  </div>
                ) : (
                  <Button variant="outline" size="sm">
                    Select File
                  </Button>
                )}
              </div>
              
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">How to get your GST challan?</h4>
                      <ol className="list-decimal text-sm text-amber-700 ml-4 space-y-1">
                        <li>Log in to the GST Portal using your credentials</li>
                        <li>Go to 'Services' &gt; 'Payments' &gt; 'Create Challan'</li>
                        <li>Fill in the required details and generate the challan</li>
                        <li>Download the PDF file of the generated challan</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-4 p-4 border rounded-md">
                <div className="space-y-2">
                  <Label htmlFor="invoice-number">Invoice/CPIN Number</Label>
                  <Input 
                    id="invoice-number" 
                    placeholder="Enter invoice or CPIN number" 
                    value={invoiceNumber} 
                    onChange={(e) => setInvoiceNumber(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax-amount">Tax Amount (₹)</Label>
                  <Input 
                    id="tax-amount" 
                    type="number" 
                    placeholder="Enter tax amount" 
                    value={taxAmount} 
                    onChange={(e) => setTaxAmount(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <Button 
            onClick={handleNext} 
            className="w-full" 
            disabled={inputMethod === "upload" && !selectedFile || inputMethod === "manual" && (!invoiceNumber || !taxAmount)}
          >
            Continue to Payment Method
          </Button>
        </div>
      )}

      {step === 2 && (
        <PaymentMethodSelectionStep
          selectedPaymentMethod={selectedPaymentMethod}
          onSelect={setSelectedPaymentMethod}
          onBack={handleBack}
          onNext={handleNext}
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          frequency={frequency}
          onPaymentTypeChange={setPaymentType}
          onScheduledDateChange={setScheduledDate}
          onFrequencyChange={setFrequency}
        />
      )}

      {step === 3 && (
        <RewardTopUpStep
          amount={getTaxAmount()}
          onBack={handleBack}
          onNext={handleRewardPackageSelected}
        />
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h3 className="font-medium text-lg mb-2">Review GST Payment</h3>
          
          <TransactionDetailCard title="Taxpayer Details" className="mt-4">
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">GSTIN</p>
                  <p className="font-medium">{challanData.taxpayer.gstin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Name</p>
                  <p className="font-medium">{challanData.taxpayer.businessName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{challanData.taxpayer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{challanData.taxpayer.mobile}</p>
                </div>
              </div>
            </div>
          </TransactionDetailCard>
          
          <TransactionDetailCard title="Challan Details" className="mt-4">
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">CPIN/Invoice Number</p>
                  <p className="font-medium">{challanData.challan.cpin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Generation Date</p>
                  <p className="font-medium">{challanData.challan.generationDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">{challanData.challan.expiryDate}</p>
                </div>
              </div>
            </div>
          </TransactionDetailCard>
          
          <TransactionDetailCard title="Tax Breakdown" className="mt-4">
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-5 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">CGST</p>
                  <p className="font-medium">₹{challanData.taxes.cgst}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SGST</p>
                  <p className="font-medium">₹{challanData.taxes.sgst}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IGST</p>
                  <p className="font-medium">₹{challanData.taxes.igst}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cess</p>
                  <p className="font-medium">₹{challanData.taxes.cess}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total</p>
                  <p className="font-bold">₹{challanData.taxes.total}</p>
                </div>
              </div>
            </div>
          </TransactionDetailCard>
          
          <TransactionDetailCard title="Payment Details" className="mt-4">
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Payment Mode</p>
                <p className="font-medium">NEFT/RTGS - {challanData.payment.bankName}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Beneficiary Name</p>
                  <p className="font-medium">{challanData.payment.beneficiaryName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IFSC</p>
                  <p className="font-medium">{challanData.payment.ifsc}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="font-medium">{challanData.payment.accountNumber}</p>
                </div>
              </div>
            </div>
          </TransactionDetailCard>
          
          <TransactionDetailCard title="Payment Summary" className="mt-4 bg-primary/5 border-primary/20">
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST Amount</span>
                <span className="font-medium">₹{challanData.fees.gstAmount}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing Fee (Govt)</span>
                <span className="font-medium">₹{challanData.fees.processingFeeGovt}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee (PaySphere)</span>
                <span className="font-medium">₹{challanData.fees.platformFee}</span>
              </div>
              
              {selectedRewardPackage && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reward Package ({selectedRewardPackage.name} {selectedRewardPackage.percentage}%)</span>
                  <span className="font-medium">₹{getRewardPackageCost()}</span>
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-medium text-base bg-white p-3 rounded-md shadow-sm">
                <span>Total Amount</span>
                <span className="text-primary font-bold">
                  ₹{challanData.fees.total + getRewardPackageCost()}
                </span>
              </div>
              
              {selectedRewardPackage && (
                <div className="flex justify-between text-sm text-primary">
                  <span>Total Rewards Earned</span>
                  <span className="font-medium">
                    {Math.floor(getTaxAmount() / 10 * selectedRewardPackage.multiplier)} points
                    {selectedRewardPackage.multiplier > 1 && (
                      <span className="text-green-500 ml-1">
                        (+{Math.floor(getTaxAmount() / 10 * (selectedRewardPackage.multiplier - 1))})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </TransactionDetailCard>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
            <Button className="flex-1">Confirm Payment</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GSTPaymentForm;
