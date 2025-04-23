
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Payee } from "@/types/payee";
import { PaymentMethod } from "@/types/payment-method";
import { formatCurrency } from "@/utils/formatters";
import { 
  CreditCard, 
  BanknoteIcon, 
  IndianRupee, 
  PhoneIcon,
  CheckCircle,
  BadgePercent
} from "lucide-react";
import { PaymentScheduleType } from "./PaymentScheduleSelector";
import { RewardPackage } from "./RewardTopUpStep";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Employee {
  name: string;
  email: string;
  accountNumber: string;
  bankName: string;
  salaryAmount: number;
}

interface TransactionSummaryProps {
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  amount: number;
  description: string;
  invoiceReference: string;
  frequency?: string;
  payee?: Payee;
  paymentMethod?: PaymentMethod;
  platformFee: number;
  gatewayFee: number;
  rewardPackageCost?: number;
  rewardPackage?: RewardPackage | null;
  totalAmount: number;
  rewardPoints: number;
  employees?: Employee[];
  onBack: () => void;
}

export const TransactionSummary = ({
  paymentType,
  scheduledDate,
  amount,
  description,
  invoiceReference,
  frequency,
  payee,
  paymentMethod,
  platformFee,
  gatewayFee,
  rewardPackageCost = 0,
  rewardPackage,
  totalAmount,
  rewardPoints,
  employees,
  onBack
}: TransactionSummaryProps) => {
  const [showEmployees, setShowEmployees] = useState(false);
  
  const getPaymentIcon = (method?: PaymentMethod) => {
    if (!method) return null;
    
    switch (method.type) {
      case "card":
        return <CreditCard className="h-5 w-5 text-primary" />;
      case "bank":
        return <BanknoteIcon className="h-5 w-5 text-purple-500" />;
      case "bnpl":
        return <IndianRupee className="h-5 w-5 text-green-500" />;
      case "upi":
        return <PhoneIcon className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getPaymentMethodDisplay = (method?: PaymentMethod) => {
    if (!method) return "Not selected";
    
    switch (method.type) {
      case "card":
        return `${method.cardType} •••• ${method.lastFourDigits} | Exp: ${method.expiryDate}`;
      case "bank":
        return `${method.bankName} •••• ${method.lastFourDigits}`;
      case "bnpl":
        return `${method.provider} | Available: ₹${method.availableCredit.toLocaleString()}`;
      case "upi":
        return method.upiId;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Review & Confirm</h2>
        <p className="text-muted-foreground">Review payment details before confirming</p>
      </div>
      
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between bg-primary/10 p-4 border-b">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Payment Summary</h3>
          </div>
          <div className="text-sm font-medium">
            {invoiceReference && `Ref: ${invoiceReference}`}
          </div>
        </div>
        
        <CardContent className="p-4 divide-y divide-border">
          <div className="py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Payment Details</h4>
              
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description</span>
                  <span>{description || "N/A"}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Type</span>
                  <span className="capitalize">{paymentType}</span>
                </div>
                
                {paymentType === "later" && scheduledDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled Date</span>
                    <span>{scheduledDate.toLocaleDateString()}</span>
                  </div>
                )}
                
                {paymentType === "recurring" && (
                  <>
                    {scheduledDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date</span>
                        <span>{scheduledDate.toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency</span>
                      <span className="capitalize">{frequency}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {payee && (
              <div>
                <h4 className="text-sm font-medium mb-3">Payee Information</h4>
                
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span>{payee.name}</span>
                  </div>
                  
                  {payee.email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span>{payee.email}</span>
                    </div>
                  )}
                  
                  {payee.contactNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contact</span>
                      <span>{payee.contactNumber}</span>
                    </div>
                  )}
                  
                  {payee.bankName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank</span>
                      <span>{payee.bankName}</span>
                    </div>
                  )}
                  
                  {payee.accountNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account</span>
                      <span>{payee.accountNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {employees && employees.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3">Payroll Information</h4>
                
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employees</span>
                    <span>{employees.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Salary</span>
                    <span>{formatCurrency(employees.reduce((sum, emp) => sum + emp.salaryAmount, 0))}</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => setShowEmployees(true)}
                  >
                    View Employees
                  </Button>
                  
                  <Dialog open={showEmployees} onOpenChange={setShowEmployees}>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Employee List ({employees.length})</DialogTitle>
                      </DialogHeader>
                      
                      <div className="max-h-[400px] overflow-y-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-xs text-muted-foreground border-b">
                              <th className="text-left p-2">Name</th>
                              <th className="text-left p-2">Email</th>
                              <th className="text-left p-2">Bank</th>
                              <th className="text-right p-2">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {employees.map((employee, index) => (
                              <tr key={index} className="text-sm">
                                <td className="p-2">{employee.name}</td>
                                <td className="p-2">{employee.email}</td>
                                <td className="p-2">{employee.bankName}</td>
                                <td className="p-2 text-right font-medium">
                                  {formatCurrency(employee.salaryAmount)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
            
            {paymentMethod && (
              <div>
                <h4 className="text-sm font-medium mb-3">Payment Method</h4>
                
                <div className="flex items-center gap-3 p-3 border rounded-md">
                  <div className={`h-10 w-10 rounded-full ${
                    paymentMethod.type === 'card' ? 'bg-primary/10' : 
                    paymentMethod.type === 'bank' ? 'bg-purple-500/10' : 
                    paymentMethod.type === 'bnpl' ? 'bg-green-500/10' : 
                    'bg-blue-500/10'
                  } flex items-center justify-center`}>
                    {getPaymentIcon(paymentMethod)}
                  </div>
                  <div>
                    <div className="font-medium">{getPaymentMethodDisplay(paymentMethod)}</div>
                    <div className="text-xs text-muted-foreground capitalize">{paymentMethod.type}</div>
                  </div>
                </div>
              </div>
            )}

            {rewardPackage && (
              <div>
                <h4 className="text-sm font-medium mb-3">Reward Package</h4>
                
                <div className="flex items-center gap-3 p-3 border rounded-md">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BadgePercent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {rewardPackage.name} Package ({rewardPackage.multiplier}X Points)
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rewardPackage.percentage}% of transaction amount
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="py-4">
            <div className="bg-muted/30 p-4 rounded-md space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction Amount</span>
                <span>{formatCurrency(amount)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee</span>
                <span>{formatCurrency(platformFee)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gateway Fee</span>
                <span>{formatCurrency(gatewayFee)}</span>
              </div>
              
              {rewardPackage && rewardPackageCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Reward Package ({rewardPackage.name} {rewardPackage.percentage}%)
                  </span>
                  <span>{formatCurrency(rewardPackageCost)}</span>
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-medium">
                <span>Total Amount</span>
                <span className="text-lg">{formatCurrency(totalAmount)}</span>
              </div>
              
              <div className="flex justify-between text-primary">
                <span>Reward Points Earned</span>
                <span className="font-medium">
                  {rewardPoints.toLocaleString()} points
                  {rewardPackage && (
                    <span className="text-green-500 ml-1">
                      (+{Math.floor(amount / 10 * (rewardPackage.multiplier - 1))} bonus)
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-between gap-4">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button className="flex-1">
              Confirm Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
