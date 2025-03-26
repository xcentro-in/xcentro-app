import { useState, useMemo } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { PaymentSummary } from "./PaymentSummary";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";

interface BatchPaymentFormProps {
  onStepChange: (step: number) => void;
}

interface PaymentRow {
  id: string;
  payee: string;
  amount: number;
  description: string;
  bankAccount: string;
  ifsc: string;
}

const BatchPaymentForm = ({ onStepChange }: BatchPaymentFormProps) => {
  const [step, setStep] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();

  // Sample payment data
  const paymentRows: PaymentRow[] = [
    {
      id: "1",
      payee: "Office Supplies Co.",
      amount: 2499.99,
      description: "Monthly supplies",
      bankAccount: "XXXX1234",
      ifsc: "HDFC0001234",
    },
    {
      id: "2",
      payee: "Cloud Services",
      amount: 899.00,
      description: "Cloud hosting",
      bankAccount: "XXXX5678",
      ifsc: "ICIC0009876",
    },
  ];

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

  // Handle checkbox selection for all rows
  const handleSelectAll = () => {
    if (selectedRows.length === paymentRows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paymentRows.map(row => row.id));
    }
  };

  // Handle individual row selection
  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Calculate total amount of selected rows
  const totalSelectedAmount = useMemo(() => {
    return paymentRows
      .filter(row => selectedRows.includes(row.id))
      .reduce((sum, row) => sum + row.amount, 0);
  }, [selectedRows, paymentRows]);

  // Get the selected payment method details
  const paymentMethod = useMemo(() => {
    return mockPaymentMethods.find(m => m.id === selectedPaymentMethod);
  }, [selectedPaymentMethod]);

  // Calculate fees based on total amount
  const platformFee = useMemo(() => totalSelectedAmount * 0.01, [totalSelectedAmount]);
  const gatewayFee = useMemo(() => totalSelectedAmount * 0.005, [totalSelectedAmount]);
  const totalPayable = useMemo(() => totalSelectedAmount + platformFee + gatewayFee, [totalSelectedAmount, platformFee, gatewayFee]);
  const rewardPoints = useMemo(() => Math.floor(totalSelectedAmount / 10), [totalSelectedAmount]);

  // Get selected payment rows
  const selectedPaymentDetails = useMemo(() => {
    return paymentRows.filter(row => selectedRows.includes(row.id));
  }, [selectedRows, paymentRows]);

  return (
    <div className="space-y-6">
      {step === 1 && (
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Upload Batch Payment File</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a CSV or Excel file with payment details
              </p>
            </div>
            <Input type="file" className="mx-auto" />
          </div>
          
          <div className="text-center">
            <span className="text-sm text-muted-foreground">or</span>
          </div>

          <Button variant="outline" className="w-full">
            Enter Payments Manually
          </Button>

          <Button onClick={handleNext} className="w-full">
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedRows.length === paymentRows.length} 
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                  <TableHead>Payee</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Bank Account</TableHead>
                  <TableHead>IFSC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedRows.includes(row.id)}
                        onCheckedChange={() => handleSelectRow(row.id)}
                        aria-label={`Select ${row.payee}`}
                      />
                    </TableCell>
                    <TableCell>{row.payee}</TableCell>
                    <TableCell>${row.amount.toFixed(2)}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.bankAccount}</TableCell>
                    <TableCell>{row.ifsc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {selectedRows.length > 0 && (
            <div className="p-4 bg-muted/20 rounded-md">
              <p className="text-right">
                <span className="text-sm text-muted-foreground mr-2">Total amount selected:</span>
                <span className="font-bold">${totalSelectedAmount.toFixed(2)}</span>
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              className="flex-1"
              disabled={selectedRows.length === 0}
            >
              Continue to Payment Methods
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="font-medium mb-2">Select Payment Method</h3>
          
          <PaymentMethodSelector 
            onSelect={setSelectedPaymentMethod}
            selectedMethodId={selectedPaymentMethod}
          />

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
            <Button 
              onClick={handleNext} 
              className="flex-1"
              disabled={!selectedPaymentMethod}
            >
              Review Payment
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <PaymentSummary
          paymentType="now"
          amount={totalSelectedAmount}
          description="Batch Payment"
          invoiceReference={`BP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`}
          payee={{
            id: "batch-payment",
            name: `Multiple Payees (${selectedRows.length})`,
            email: "",
            contactNumber: "",
            type: "payroll",
            bankName: "Multiple Banks",
            accountNumber: "Multiple Accounts",
            ifscCode: "",
            createdAt: new Date().toISOString(),
            isDefault: false,
            salaryAmount: totalSelectedAmount,
            salaryType: "fixed",
            payrollCycle: "monthly"
          }}
          paymentMethod={paymentMethod}
          platformFee={platformFee}
          gatewayFee={gatewayFee}
          totalAmount={totalPayable}
          rewardPoints={rewardPoints}
          employees={selectedPaymentDetails.map(row => ({
            name: row.payee,
            email: "",
            accountNumber: row.bankAccount,
            bankName: `Bank (IFSC: ${row.ifsc})`,
            salaryAmount: row.amount
          }))}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default BatchPaymentForm;
