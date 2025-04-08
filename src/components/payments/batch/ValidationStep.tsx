
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentRow } from "./types";

interface ValidationStepProps {
  paymentRows: PaymentRow[];
  selectedRows: string[];
  onSelectRow: (id: string) => void;
  onSelectAll: () => void;
  onBack: () => void;
  onNext: () => void;
}

const ValidationStep = ({ 
  paymentRows, 
  selectedRows, 
  onSelectRow, 
  onSelectAll, 
  onBack, 
  onNext 
}: ValidationStepProps) => {
  const totalSelectedAmount = useMemo(() => {
    return paymentRows
      .filter(row => selectedRows.includes(row.id))
      .reduce((sum, row) => sum + row.amount, 0);
  }, [selectedRows, paymentRows]);
  
  return (
    <div className="space-y-4">
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

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack} className="w-auto">
          Back
        </Button>
        <Button 
          onClick={onNext} 
          className="w-auto"
          disabled={selectedRows.length === 0}
        >
          Continue to Payment Methods
        </Button>
      </div>
    </div>
  );
};

export default ValidationStep;
