import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
interface BatchPaymentFormProps {
  onStepChange: (step: number) => void;
}
const BatchPaymentForm = ({
  onStepChange
}: BatchPaymentFormProps) => {
  const [step, setStep] = useState(1);
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
  return <div className="space-y-6">
      {step === 1 && <div className="space-y-4">
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
        </div>}

      {step === 2 && <div className="space-y-4">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payee</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Office Supplies Co.</TableCell>
                  <TableCell>$2,499.99</TableCell>
                  <TableCell>Monthly supplies</TableCell>
                  <TableCell className="text-green-600">Valid</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cloud Services</TableCell>
                  <TableCell>$899.00</TableCell>
                  <TableCell>Cloud hosting</TableCell>
                  <TableCell className="text-green-600">Valid</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
            <Button onClick={handleNext} className="flex-1">
              Continue to Payment Methods
            </Button>
          </div>
        </div>}

      {step === 3 && <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-medium">$3,398.99</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee</span>
                <span className="font-medium">$33.99</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Gateway Fee</span>
                <span className="font-medium">$17.00</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Payable</span>
                  <span>$3,449.98</span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-green-600 bg-green-50 p-2 rounded-md">
                <span>Total Reward Points</span>
                <span>340 points</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
            <Button className="flex-1">Confirm Batch Payment</Button>
          </div>
        </div>}
    </div>;
};
export default BatchPaymentForm;