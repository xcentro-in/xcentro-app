import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatters";
import { mockPayees } from "@/data/mockPayees";
import { PaymentType } from "../../quick-payment/CombinedDetailsStep";
import { VendorPayee, BillerPayee, EmployeePayee } from "@/types/payee";

interface ReviewStepProps {
  paymentType: PaymentType;
  scheduledDate?: Date;
  amount: number;
  description: string;
  invoiceReference: string;
  frequency: string;
  selectedPayee?: string;
  onBack: () => void;
  onNext: () => void;
}

const ReviewStep = ({
  paymentType,
  scheduledDate,
  amount,
  description,
  invoiceReference,
  frequency,
  selectedPayee,
  onBack,
  onNext,
}: ReviewStepProps) => {
  const payeeDetails = selectedPayee ? mockPayees.find(payee => payee.id === selectedPayee) : undefined;

  const formatScheduleText = () => {
    if (paymentType === "now") return "Immediate";
    if (paymentType === "later" && scheduledDate) {
      return `Scheduled for ${scheduledDate.toLocaleDateString()}`;
    }
    if (paymentType === "recurring" && scheduledDate) {
      return `Recurring ${frequency} starting ${scheduledDate.toLocaleDateString()}`;
    }
    return "Not specified";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Review Payment Details</h2>
        <p className="text-muted-foreground">
          Please review your payment details before proceeding
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-lg">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Schedule</span>
              <span className="font-medium">{formatScheduleText()}</span>
            </div>
            {description && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Description</span>
                <span className="font-medium max-w-32 text-right">{description}</span>
              </div>
            )}
            {invoiceReference && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice Reference</span>
                <span className="font-medium">{invoiceReference}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payee Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payee Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {payeeDetails ? (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{payeeDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{payeeDetails.type}</span>
                </div>
                {payeeDetails.type === 'bank' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account</span>
                      <span className="font-medium">****{(payeeDetails as VendorPayee).accountNumber.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank</span>
                      <span className="font-medium">{(payeeDetails as VendorPayee).bankName}</span>
                    </div>
                  </>
                )}
                {payeeDetails.type === 'payroll' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account</span>
                      <span className="font-medium">****{(payeeDetails as EmployeePayee).accountNumber.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank</span>
                      <span className="font-medium">{(payeeDetails as EmployeePayee).bankName}</span>
                    </div>
                  </>
                )}
                {payeeDetails.type === 'biller' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biller</span>
                    <span className="font-medium">{(payeeDetails as BillerPayee).billerName}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-center py-4">No payee selected</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Total Payment</h3>
              <p className="text-muted-foreground">
                {payeeDetails ? `To ${payeeDetails.name}` : 'Payment recipient not selected'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
              <div className="text-sm text-muted-foreground">{formatScheduleText()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={onBack} className="w-auto">
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!payeeDetails || amount <= 0}
          className="w-auto"
        >
          Proceed to Payment Method
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;