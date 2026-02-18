import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { BatchUploadResponse, VoucherCreationResponse, MatchedPayment } from "./types";
import { CheckCircle, AlertTriangle, XCircle, Upload, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { voucherAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

interface ValidationStepProps {
  uploadResponse: BatchUploadResponse;
  selectedRows: string[]; // Array of row_numbers as strings
  processedRowNumbers: Set<number>; // Row numbers that already have vouchers created
  onSelectRow: (rowNumber: string) => void;
  onSelectAll: () => void;
  onReupload: () => void;
  onNext: (createdVouchers: VoucherCreationResponse, selectedPayments: MatchedPayment[]) => void;
}

const ValidationStep = ({
  uploadResponse,
  selectedRows,
  processedRowNumbers,
  onSelectRow,
  onSelectAll,
  onReupload,
  onNext,
}: ValidationStepProps) => {
  const { user } = useAuth();
  const { businessId, businessName } = useCurrentBusiness();
  // Handle null values from API - convert to empty arrays
  const matched = uploadResponse.data.matched || [];
  const ambiguous = uploadResponse.data.ambiguous || [];
  const not_found = uploadResponse.data.not_found || [];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSelectedAmount = useMemo(() => {
    return matched
      .filter(row => selectedRows.includes(row.row_number.toString()))
      .reduce((sum, row) => sum + row.amount, 0);
  }, [selectedRows, matched]);

  const allMatchedSelected = matched.length > 0 && selectedRows.length === matched.length;

  const handleContinue = async () => {
    if (!businessId) {
      toast.error("Business ID not found");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get selected payments from matched array
      const selectedPayments = matched.filter(payment =>
        selectedRows.includes(payment.row_number.toString())
      );

      // Filter out already-processed rows (to avoid duplicate vouchers)
      const newPaymentsToProcess = selectedPayments.filter(payment =>
        !processedRowNumbers.has(payment.row_number)
      );

      // If no new payments to process, just move to next step
      if (newPaymentsToProcess.length === 0) {
        toast.info("All selected payments have already been processed");
        setIsSubmitting(false);
        // Still move to next step to show existing vouchers
        onNext({ data: { vouchers: [], message: "No new vouchers created" }, status: "success", message: "No new vouchers created" }, []);
        return;
      }

      // Map to voucher creation format (only for NEW payments)
      const vouchers = newPaymentsToProcess.map(payment => {
        // Calculate amounts from total amount
        // Since we have total amount, we'll use it as gross_amount
        // and derive net_amount by subtracting GST (if we had GST breakdown, otherwise use same)
        const grossAmount = payment.amount; // in paise
        const gstAmount = 0; // Default to 0 as we don't have GST breakdown in response
        const tdsAmount = 0; // Default to 0 as we don't have TDS info
        const netAmount = grossAmount + gstAmount - tdsAmount;

        return {
          relation_id: payment.matched_relation_id, // REQUIRED
          invoice_number: payment.invoice_number, // REQUIRED - Use invoice_number from response
          invoice_date: undefined, // OPTIONAL - Not in response
          gross_amount: grossAmount, // REQUIRED (in paise)
          net_amount: netAmount, // REQUIRED (in paise)
          gst_amount: gstAmount, // REQUIRED (in paise)
          tds_amount: tdsAmount, // REQUIRED (in paise)
          expense_category: payment.payment_context, // OPTIONAL - Use payment_context as category
          description: payment.description, // OPTIONAL
        };
      });

      // Call API to create multiple vouchers (only for new payments)
      const response = await voucherAPI.createMultiple(businessId, vouchers) as VoucherCreationResponse;

      // Check response status
      if (response.status === 'success' && response.data.vouchers) {
        trackEvent('voucher_created');
        // Show success toast with actual count from response
        const newCount = response.data.vouchers.length;
        const alreadyProcessedCount = selectedPayments.length - newPaymentsToProcess.length;

        if (alreadyProcessedCount > 0) {
          toast.success(`Created ${newCount} new voucher(s). ${alreadyProcessedCount} payment(s) were already processed.`);
        } else {
          toast.success(response.data.message || `Successfully created ${newCount} draft voucher(s)`);
        }

        // Move to next step with the created vouchers and NEW selected payments only
        onNext(response, newPaymentsToProcess);
      } else {
        // Handle unexpected response format
        toast.error("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      console.error("Failed to create vouchers:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create vouchers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with summary and re-upload button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Validate Payment Data</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Processed {uploadResponse.data.total_rows} rows from {uploadResponse.data.file_name}
          </p>
        </div>
        <Button variant="outline" onClick={onReupload}>
          <Upload className="h-4 w-4 mr-2" />
          Re-upload
        </Button>
      </div>

      {/* Legend */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm">Matched - Ready to pay</span>
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm">Ambiguous - Partial match, needs review</span>
          </span>
          <span className="flex items-center gap-1">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm">Not Found - No match in system</span>
          </span>
        </AlertDescription>
      </Alert>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uploadResponse.data.total_rows}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Matched</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{uploadResponse.data.matched_count}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Ambiguous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{uploadResponse.data.ambiguous_count}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{uploadResponse.data.not_found_count}</div>
          </CardContent>
        </Card>
      </div>

      {/* Matched Payments - Selectable */}
      {matched.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <CardTitle>Matched Payments ({matched.length})</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSelectAll}
                  disabled={isSubmitting}
                >
                  {allMatchedSelected ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={selectedRows.length === 0 || isSubmitting}
                  size="sm"
                >
                  {isSubmitting ? 'Creating vouchers...' : `Continue with ${selectedRows.length} payment${selectedRows.length !== 1 ? 's' : ''}`}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {matched.map((payment) => {
                const isAlreadyProcessed = processedRowNumbers.has(payment.row_number);
                return (
                <div
                  key={payment.row_number}
                  className={`flex items-start gap-3 p-4 border rounded-lg transition-colors ${
                    isAlreadyProcessed ? 'bg-green-50 border-green-200' : 'hover:bg-muted/50'
                  }`}
                >
                  <Checkbox
                    checked={selectedRows.includes(payment.row_number.toString())}
                    onCheckedChange={() => onSelectRow(payment.row_number.toString())}
                    disabled={isAlreadyProcessed}
                    className="mt-1"
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">Row #{payment.row_number}</p>
                        {isAlreadyProcessed && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Created
                          </Badge>
                        )}
                      </div>
                      <p className="font-medium text-sm mt-1">{payment.csv_payee_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Matched As</p>
                      <p className="font-medium text-sm mt-1">{payment.matched_payee_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-medium text-sm mt-1">{formatCurrency(payment.amount / 100)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Account</p>
                      <p className="font-medium text-sm mt-1">
                        {payment.csv_account_last_4 ? `•••• ${payment.csv_account_last_4}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <p className="font-medium text-sm mt-1">
                        {(payment.match_confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm mt-1 truncate" title={payment.description}>
                        {payment.description}
                      </p>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {selectedRows.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-green-900">
                    <span className="font-semibold">{selectedRows.length}</span> payment(s) selected
                  </p>
                  <p className="text-lg font-bold text-green-900">
                    {formatCurrency(totalSelectedAmount / 100)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ambiguous Payments - Warning */}
      {ambiguous.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <CardTitle>Ambiguous Payments ({ambiguous.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ambiguous.map((payment) => (
                <div
                  key={payment.row_number}
                  className="p-4 border border-yellow-200 rounded-lg bg-yellow-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Row #{payment.row_number}</p>
                      <p className="font-medium text-sm mt-1">{payment.csv_payee_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-medium text-sm mt-1">{formatCurrency(payment.amount / 100)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Account</p>
                      <p className="font-medium text-sm mt-1">
                        {payment.csv_account_last_4 ? `•••• ${payment.csv_account_last_4}` : 'N/A'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm mt-1">{payment.description}</p>
                    </div>
                  </div>
                  <div className="pl-4 border-l-2 border-yellow-300">
                    <p className="text-xs font-semibold text-yellow-900 mb-2">Possible Matches:</p>
                    <div className="space-y-2">
                      {payment.possible_matches.map((match, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                          <span className="font-medium">{match.payee_name}</span>
                          <span className="text-muted-foreground">
                            {(match.match_confidence * 100).toFixed(0)}% match
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Not Found Payments - Error */}
      {not_found.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <CardTitle>Not Found Payments ({not_found.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {not_found.map((payment) => (
                <div
                  key={payment.row_number}
                  className="p-4 border border-red-200 rounded-lg bg-red-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Row #{payment.row_number}</p>
                      <p className="font-medium text-sm mt-1">{payment.csv_payee_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-medium text-sm mt-1">{formatCurrency(payment.amount / 100)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Account</p>
                      <p className="font-medium text-sm mt-1">
                        {payment.csv_account_last_4 ? `•••• ${payment.csv_account_last_4}` : 'N/A'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm mt-1">{payment.description}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reason</p>
                      <p className="text-sm mt-1 text-red-700 font-medium">{payment.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ValidationStep;
