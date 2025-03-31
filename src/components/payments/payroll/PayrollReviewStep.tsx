
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Employee } from "./types";
import { PaymentScheduleType } from "../common/PaymentScheduleSelector";

interface PayrollReviewStepProps {
  selectedEmployees: Employee[];
  selectedPaymentMethod?: string;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  onBack: () => void;
  onSubmit: () => void;
}

const PayrollReviewStep = ({
  selectedEmployees,
  selectedPaymentMethod,
  paymentType,
  scheduledDate,
  frequency,
  onBack,
  onSubmit
}: PayrollReviewStepProps) => {
  // Calculate totals
  const totalSalary = selectedEmployees.reduce(
    (sum, employee) => sum + employee.salaryAmount,
    0
  );
  
  const platformFee = totalSalary * 0.015;
  const processingFee = totalSalary * 0.005;
  const totalAmount = totalSalary + platformFee + processingFee;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review Payroll Payment</h3>
      
      <div className="space-y-4">
        <Card className="p-4">
          <h4 className="font-medium mb-2">Payment Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Payment Type</p>
              <p className="font-medium">
                {paymentType === "now" 
                  ? "Immediate Payment" 
                  : paymentType === "later" 
                    ? "Scheduled Payment" 
                    : "Recurring Payment"}
              </p>
            </div>
            {paymentType !== "now" && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {paymentType === "later" ? "Scheduled Date" : "Start Date"}
                </p>
                <p className="font-medium">
                  {scheduledDate?.toLocaleDateString() || "Not specified"}
                </p>
              </div>
            )}
            {paymentType === "recurring" && (
              <div>
                <p className="text-sm text-muted-foreground">Frequency</p>
                <p className="font-medium capitalize">{frequency}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-medium">{selectedPaymentMethod || "Not specified"}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h4 className="font-medium mb-2">Employees ({selectedEmployees.length})</h4>
          <div className="space-y-3">
            {selectedEmployees.map((employee) => (
              <div 
                key={employee.id} 
                className="flex justify-between items-center border-b pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">{employee.accountNumber}</p>
                </div>
                <p className="font-medium">₹{employee.salaryAmount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-4 bg-primary/5">
          <h4 className="font-medium mb-3">Payment Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Salary Amount</span>
              <span>₹{totalSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Fee (1.5%)</span>
              <span>₹{platformFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing Fee (0.5%)</span>
              <span>₹{processingFee.toLocaleString()}</span>
            </div>
            <div className="h-px bg-border my-2"></div>
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onSubmit} className="flex-1">
          Confirm Payment
        </Button>
      </div>
    </div>
  );
};

export default PayrollReviewStep;
