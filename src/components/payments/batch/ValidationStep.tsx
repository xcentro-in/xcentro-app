
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatters";
import { PaymentRow } from "./types";
import PaymentScheduleSelector, { PaymentScheduleType } from "../common/PaymentScheduleSelector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ValidationStepProps {
  paymentRows: PaymentRow[];
  selectedRows: string[];
  onSelectRow: (id: string) => void;
  onSelectAll: () => void;
  onBack: () => void;
  onNext: () => void;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  onPaymentTypeChange: (value: PaymentScheduleType) => void;
  onScheduledDateChange: (date?: Date) => void;
  onFrequencyChange: (value: string) => void;
}

const ValidationStep = ({ 
  paymentRows, 
  selectedRows, 
  onSelectRow, 
  onSelectAll, 
  onBack, 
  onNext,
  paymentType,
  scheduledDate,
  frequency,
  onPaymentTypeChange,
  onScheduledDateChange,
  onFrequencyChange
}: ValidationStepProps) => {
  const totalSelectedAmount = useMemo(() => {
    return paymentRows
      .filter(row => selectedRows.includes(row.id))
      .reduce((sum, row) => sum + row.amount, 0);
  }, [selectedRows, paymentRows]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Validate Payment Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedRows.length === paymentRows.length} 
                      onCheckedChange={onSelectAll}
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
                        onCheckedChange={() => onSelectRow(row.id)}
                        aria-label={`Select ${row.payee}`}
                      />
                    </TableCell>
                    <TableCell>{row.payee}</TableCell>
                    <TableCell>{formatCurrency(row.amount)}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.bankAccount}</TableCell>
                    <TableCell>{row.ifsc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {selectedRows.length > 0 && (
            <div className="p-4 bg-muted/20 rounded-md mt-4">
              <p className="text-right">
                <span className="text-sm text-muted-foreground mr-2">Total amount selected:</span>
                <span className="font-bold">{formatCurrency(totalSelectedAmount)}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>When to Schedule Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentScheduleSelector
            paymentType={paymentType}
            scheduledDate={scheduledDate}
            frequency={frequency}
            onPaymentTypeChange={onPaymentTypeChange}
            onScheduledDateChange={onScheduledDateChange}
            onFrequencyChange={onFrequencyChange}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack} className="w-auto">
          Back
        </Button>
        <Button 
          onClick={onNext} 
          className="w-auto"
          disabled={selectedRows.length === 0 || (paymentType === "later" && !scheduledDate) || (paymentType === "recurring" && (!scheduledDate || !frequency))}
        >
          Select Payment Method
        </Button>
      </div>
    </div>
  );
};

export default ValidationStep;
