import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { voucherAPI } from "@/services/api";
import { EXPENSE_CATEGORIES } from "@/constants/expenseCategories";
import { PAYMENT_TERMS } from "@/constants/paymentTerms";
import { GST_RATES, GST_TYPES, GSTType } from "@/constants/gstRates";
import PayeeAutocompleteInput from "@/components/payments/payee-management/payee/PayeeAutocompleteInput";
import BankPayeeForm from "@/components/payees/forms/BankPayeeForm";
import { useVendors } from "@/hooks/useVendors";
import { GetVoucherDraftResponse } from "@/types/voucher";

/*
 * FUTURE OCR IMPLEMENTATION PLAN
 * ==============================
 *
 * When OCR feature is reintroduced, implement the following UX:
 *
 * 1. LAYOUT:
 *    - Split screen: Left side shows uploaded document (PDF viewer or image)
 *    - Right side shows the editable form (same as current form)
 *    - Both views remain visible throughout the process
 *
 * 2. DOCUMENT VIEWER:
 *    - Support PDF and image formats (JPEG, PNG)
 *    - Zoom in/out controls
 *    - Page navigation for multi-page PDFs
 *    - Highlight capability for matched regions
 *
 * 3. FIELD MATCHING:
 *    - When user clicks a form field, highlight the corresponding region in document
 *    - Show confidence score for OCR-parsed values (e.g., "95% confident")
 *    - Color code: Green (high confidence), Yellow (medium), Red (low)
 *
 * 4. EDITING WORKFLOW:
 *    - All parsed fields are editable
 *    - User can override any OCR value
 *    - "Accept All" button to quickly approve high-confidence values
 *    - "Review Low Confidence" button to jump to fields needing attention
 *
 * 5. VERIFICATION:
 *    - Checklist of critical fields that must be verified
 *    - "Verify & Save" button (replaces current "Save & Continue")
 *    - Warning if user tries to save without verifying low-confidence fields
 *
 * 6. FALLBACK:
 *    - If OCR fails or is not available, form works exactly as current implementation
 *    - User can always manually fill the form without uploading a document
 *
 * TECHNICAL IMPLEMENTATION:
 * - Use react-pdf or pdf.js for PDF rendering
 * - Use canvas overlay for highlighting matched regions
 * - Store OCR confidence scores in metadata
 * - Use same data structure (billData state) for both OCR and manual entry
 */

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  gst_rate: number;
  gst_amount: number;
}

interface BillFormData {
  // Vendor information
  vendorRelationId: string; // relation_id from vendors API

  // Invoice details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  vendorReferenceNumber: string;

  // Classification
  expenseCategory: string;
  description: string;
  paymentTerms: string;

  // Line items
  items: LineItem[];

  // GST configuration
  gstType: GSTType;

  // Financial calculations
  discountType: 'amount' | 'percentage';
  discountValue: number;
  discountAmount: number;
  roundOff: boolean;
  roundOffAmount: number;

  // Totals
  subtotal: number;
  totalGst: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  grossAmount: number;
  netAmount: number;
}

const NewBill = () => {
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();
  const { user } = useAuth();
  const { vendors, isLoading: vendorsLoading, refetch: refetchVendors } = useVendors(user?.businessId);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddVendor, setShowAddVendor] = useState(false);

  useEffect(() => {
    setTitle("New Bill");
  }, [setTitle]);

  const [billData, setBillData] = useState<BillFormData>({
    vendorRelationId: '',
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    vendorReferenceNumber: '',
    expenseCategory: '',
    description: '',
    paymentTerms: 'net_30',
    items: [],
    gstType: GST_TYPES.CGST_SGST,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    roundOff: false,
    roundOffAmount: 0,
    subtotal: 0,
    totalGst: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    grossAmount: 0,
    netAmount: 0,
  });

  // Get selected vendor details
  const selectedVendor = vendors.find(v => v.relation_id === billData.vendorRelationId);

  // Calculate all financial values whenever relevant fields change
  useEffect(() => {
    calculateFinancials();
  }, [billData.items, billData.gstType, billData.discountType, billData.discountValue, billData.roundOff]);

  const calculateFinancials = () => {
    // Calculate subtotal from items (before GST)
    const subtotal = billData.items.reduce((sum, item) => sum + item.amount, 0);

    // Calculate GST totals based on GST type
    let totalGst = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    billData.items.forEach(item => {
      const itemGst = item.gst_amount;
      totalGst += itemGst;

      if (billData.gstType === GST_TYPES.CGST_SGST) {
        cgstAmount += itemGst / 2;
        sgstAmount += itemGst / 2;
      } else {
        igstAmount += itemGst;
      }
    });

    // Calculate gross amount (subtotal + GST)
    const grossAmount = subtotal + totalGst;

    // Calculate discount
    let discountAmount = 0;
    if (billData.discountType === 'percentage') {
      discountAmount = (grossAmount * billData.discountValue) / 100;
    } else {
      discountAmount = billData.discountValue;
    }

    // Calculate net amount as per backend formula: gross - discount - tds
    // Note: TDS is 0 for now (not in MVP), so net = gross - discount
    const netAmount = grossAmount - discountAmount;

    // Calculate round-off separately (NOT included in net_amount)
    // Round-off is stored in financial_details for reference
    let roundOffAmount = 0;
    if (billData.roundOff) {
      const rounded = Math.round(netAmount);
      roundOffAmount = rounded - netAmount;
    }

    // Update state with all calculated values
    setBillData(prev => ({
      ...prev,
      subtotal,
      totalGst,
      cgstAmount,
      sgstAmount,
      igstAmount,
      grossAmount,
      discountAmount,
      roundOffAmount,
      netAmount, // This is gross - discount (NOT including round-off)
    }));
  };

  const addNewItem = () => {
    setBillData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0,
        gst_rate: 18, // Default to 18%
        gst_amount: 0
      }]
    }));
  };

  const removeItem = (index: number) => {
    setBillData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof LineItem, value: any) => {
    setBillData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };

          // Recalculate amount when quantity or rate changes
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate;
          }

          // Recalculate GST when amount or gst_rate changes
          if (field === 'quantity' || field === 'rate' || field === 'gst_rate') {
            const itemAmount = updated.quantity * updated.rate;
            updated.amount = itemAmount;
            updated.gst_amount = (itemAmount * updated.gst_rate) / 100;
          }

          return updated;
        }
        return item;
      })
    }));
  };

  const handleVendorSelect = (relationId: string) => {
    setBillData(prev => ({
      ...prev,
      vendorRelationId: relationId,
    }));
  };

  const removeVendor = () => {
    setBillData(prev => ({
      ...prev,
      vendorRelationId: '',
    }));
  };

  const handlePayeeAdded = async () => {
    setShowAddVendor(false);
    toast.success("Vendor added successfully");
    // Refetch vendors to update the autocomplete list
    await refetchVendors();
  };

  const validateForm = (): boolean => {
    // Vendor validation
    if (!billData.vendorRelationId) {
      toast.error("Please select a vendor");
      return false;
    }

    // Invoice details validation
    if (!billData.invoiceNumber.trim()) {
      toast.error("Invoice number is required");
      return false;
    }

    if (!billData.invoiceDate) {
      toast.error("Invoice date is required");
      return false;
    }

    if (!billData.dueDate) {
      toast.error("Due date is required");
      return false;
    }

    // Date validation
    const invoiceDate = new Date(billData.invoiceDate);
    const dueDate = new Date(billData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (invoiceDate > today) {
      toast.error("Invoice date cannot be in the future");
      return false;
    }

    if (dueDate < invoiceDate) {
      toast.error("Due date must be on or after invoice date");
      return false;
    }

    // Line items validation
    if (billData.items.length === 0) {
      toast.error("Please add at least one line item");
      return false;
    }

    // Validate each line item
    for (let i = 0; i < billData.items.length; i++) {
      const item = billData.items[i];
      if (!item.description.trim()) {
        toast.error(`Item ${i + 1}: Description is required`);
        return false;
      }
      if (item.amount <= 0) {
        toast.error(`Item ${i + 1}: Amount must be greater than zero`);
        return false;
      }
    }

    // Expense category validation
    if (!billData.expenseCategory) {
      toast.error("Please select an expense category");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.businessId || !user?.id) {
      toast.error("User information not available");
      return;
    }

    setIsSaving(true);

    try {
      // Helper to round to 2 decimal places (accounting precision)
      const round2 = (num: number) => Math.round(num * 100) / 100;

      // Prepare financial details JSONB
      const financialDetails = {
        line_items: billData.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: round2(item.rate),
          amount: round2(item.amount),
          gst_rate: item.gst_rate, // Percentage, keep as-is
          gst_amount: round2(item.gst_amount),
        })),
        discount: {
          type: billData.discountType,
          value: round2(billData.discountValue),
          amount: round2(billData.discountAmount),
        },
        round_off: {
          applied: billData.roundOff,
          amount: round2(billData.roundOffAmount),
        },
        gst_type: billData.gstType,
      };

      // Prepare voucher payload
      // Note: Backend will handle voucher_date, fiscal_year, accounting_period, created_by_user_id, and status
      const voucherPayload = {
        relation_id: billData.vendorRelationId, // Backend will resolve to payee_id and account_id
        invoice_number: billData.invoiceNumber,
        invoice_date: billData.invoiceDate,
        invoice_due_date: billData.dueDate,
        gross_amount: Math.round(billData.grossAmount * 100), // Convert to paise
        net_amount: Math.round(billData.netAmount * 100), // Convert to paise
        cgst_amount: Math.round(billData.cgstAmount * 100),
        sgst_amount: Math.round(billData.sgstAmount * 100),
        igst_amount: Math.round(billData.igstAmount * 100),
        gst_amount: Math.round(billData.totalGst * 100),
        discount_amount: Math.round(billData.discountAmount * 100),
        expense_category: billData.expenseCategory,
        description: billData.description,
        payment_terms: billData.paymentTerms,
        vendor_reference_number: billData.vendorReferenceNumber,
        financial_details: financialDetails,
      };

      // Call API to create voucher
      const response: GetVoucherDraftResponse = await voucherAPI.createDraft(
        user?.businessId,
        { ...voucherPayload }
        );

      toast.success("Bill created successfully", {
        description: `Bill #${response.data.voucher_number} has been saved as draft`
      });

      // Navigate to bills list
      navigate('/bills');

    } catch (error) {
      console.error("Error creating bill:", error);
      toast.error("Failed to create bill", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Group items by GST rate for summary display
  const getGstBreakdown = () => {
    const breakdown: Record<number, { amount: number, gst: number }> = {};

    billData.items.forEach(item => {
      const rate = item.gst_rate;
      if (!breakdown[rate]) {
        breakdown[rate] = { amount: 0, gst: 0 };
      }
      breakdown[rate].amount += item.amount;
      breakdown[rate].gst += item.gst_amount;
    });

    return breakdown;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="w-fit pl-0 hover:pl-0 hover:bg-transparent -ml-2 text-muted-foreground"
            size="icon"
            onClick={() => navigate('/bills')}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Bills
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </div>

      {/* Main Content - Full Width Centered Form */}
      <div className="flex-1 overflow-auto bg-muted/30">
        <div className="max-w-5xl mx-auto p-6">
          <div className="space-y-6">
            {/* Page Title */}
            <div>
              <h2 className="text-2xl font-semibold">Create New Bill</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enter vendor invoice details to create a bill for payment
              </p>
            </div>

            {/* Vendor Selection */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-medium">Vendor *</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the vendor/supplier for this bill
                </p>

                <PayeeAutocompleteInput
                  selectedPayee={billData.vendorRelationId}
                  onPayeeSelect={handleVendorSelect}
                  onAddNewVendor={() => setShowAddVendor(true)}
                  className="mb-4"
                />

                {/* Show selected vendor details */}
                {selectedVendor && (
                  <Card className="bg-muted/50 mt-4">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{selectedVendor.display_name}</p>
                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <p>Email: {selectedVendor.contact_email}</p>
                            {selectedVendor.contact_phone && (
                              <p>Phone: {selectedVendor.contact_phone}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={removeVendor}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Add New Vendor Link */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Can't find the vendor?{" "}
                    <button
                      onClick={() => setShowAddVendor(true)}
                      className="text-primary hover:underline font-medium"
                    >
                      Add a new vendor
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Add Vendor Dialog */}
            <Dialog open={showAddVendor} onOpenChange={setShowAddVendor}>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Vendor</DialogTitle>
                  <DialogDescription>
                    Add a new vendor to your system. Fill in the required details to create a new payee.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <BankPayeeForm onSubmit={handlePayeeAdded} />
                </div>
              </DialogContent>
            </Dialog>

            {/* Invoice Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-base font-medium mb-4">Invoice Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                    <Input
                      id="invoiceNumber"
                      value={billData.invoiceNumber}
                      onChange={(e) => setBillData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="INV-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendorReferenceNumber">Vendor Reference / PO Number</Label>
                    <Input
                      id="vendorReferenceNumber"
                      value={billData.vendorReferenceNumber}
                      onChange={(e) => setBillData(prev => ({ ...prev, vendorReferenceNumber: e.target.value }))}
                      placeholder="PO-12345"
                    />
                  </div>
                  <div>
                    <Label htmlFor="invoiceDate">Invoice Date *</Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={billData.invoiceDate}
                      onChange={(e) => setBillData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={billData.dueDate}
                      onChange={(e) => setBillData(prev => ({ ...prev, dueDate: e.target.value }))}
                      min={billData.invoiceDate}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expenseCategory">Expense Category *</Label>
                    <Select
                      value={billData.expenseCategory}
                      onValueChange={(value) => setBillData(prev => ({ ...prev, expenseCategory: value }))}
                    >
                      <SelectTrigger id="expenseCategory">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select
                      value={billData.paymentTerms}
                      onValueChange={(value) => setBillData(prev => ({ ...prev, paymentTerms: value }))}
                    >
                      <SelectTrigger id="paymentTerms">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_TERMS.map(term => (
                          <SelectItem key={term.value} value={term.value}>
                            {term.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="description">Description / Notes</Label>
                  <Textarea
                    id="description"
                    value={billData.description}
                    onChange={(e) => setBillData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional notes about this bill..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* GST Configuration */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-base font-medium mb-4">GST Configuration</h3>
                <Label>GST Type</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select how GST should be calculated for this bill
                </p>
                <RadioGroup
                  value={billData.gstType}
                  onValueChange={(value: GSTType) => setBillData(prev => ({ ...prev, gstType: value }))}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={GST_TYPES.CGST_SGST} id="cgst_sgst" />
                    <Label htmlFor="cgst_sgst" className="font-normal cursor-pointer">
                      CGST + SGST (Intra-state)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={GST_TYPES.IGST} id="igst" />
                    <Label htmlFor="igst" className="font-normal cursor-pointer">
                      IGST (Inter-state)
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-base font-medium mb-4">Line Items *</h3>

                <div className="space-y-4">
                  {billData.items.map((item, index) => (
                    <Card key={index} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Item {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label>Description *</Label>
                            <Input
                              placeholder="Item description"
                              value={item.description}
                              onChange={(e) => updateItem(index, 'description', e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-5 gap-3">
                            <div>
                              <Label>Quantity *</Label>
                              <Input
                                type="number"
                                min="0"
                                step="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                              />
                            </div>
                            <div>
                              <Label>Rate *</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.rate}
                                onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                              />
                            </div>
                            <div>
                              <Label>Amount</Label>
                              <Input
                                type="number"
                                value={item.amount.toFixed(2)}
                                readOnly
                                className="bg-muted"
                              />
                            </div>
                            <div>
                              <Label>GST Rate *</Label>
                              <Select
                                value={String(item.gst_rate)}
                                onValueChange={(value) => updateItem(index, 'gst_rate', Number(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {GST_RATES.map(rate => (
                                    <SelectItem key={rate.value} value={String(rate.value)}>
                                      {rate.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>GST Amount</Label>
                              <Input
                                type="number"
                                value={item.gst_amount.toFixed(2)}
                                readOnly
                                className="bg-muted"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={addNewItem}
                  className="w-full mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line Item
                </Button>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-base font-medium mb-4">Bill Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium">₹ {billData.subtotal.toFixed(2)}</span>
                  </div>

                  {/* GST Breakdown */}
                  {billData.gstType === GST_TYPES.CGST_SGST ? (
                    <>
                      {Object.entries(getGstBreakdown()).map(([rate, data]) => (
                        <div key={rate} className="text-sm space-y-1">
                          <div className="flex justify-between text-muted-foreground">
                            <span>CGST @ {Number(rate) / 2}% (on ₹{data.amount.toFixed(2)})</span>
                            <span>₹ {(data.gst / 2).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>SGST @ {Number(rate) / 2}% (on ₹{data.amount.toFixed(2)})</span>
                            <span>₹ {(data.gst / 2).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-medium">
                        <span>Total CGST</span>
                        <span>₹ {billData.cgstAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Total SGST</span>
                        <span>₹ {billData.sgstAmount.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      {Object.entries(getGstBreakdown()).map(([rate, data]) => (
                        <div key={rate} className="flex justify-between text-sm text-muted-foreground">
                          <span>IGST @ {rate}% (on ₹{data.amount.toFixed(2)})</span>
                          <span>₹ {data.gst.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-medium">
                        <span>Total IGST</span>
                        <span>₹ {billData.igstAmount.toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="flex justify-between text-sm font-medium">
                    <span>Gross Amount (Subtotal + GST)</span>
                    <span>₹ {billData.grossAmount.toFixed(2)}</span>
                  </div>

                  <Separator />

                  {/* Discount */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex-1">Discount</span>
                    <Select
                      value={billData.discountType}
                      onValueChange={(value: 'amount' | 'percentage') =>
                        setBillData(prev => ({ ...prev, discountType: value }))
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">%</SelectItem>
                        <SelectItem value="amount">₹</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      className="w-24 text-right"
                      type="number"
                      min="0"
                      step={billData.discountType === 'percentage' ? '1' : '0.01'}
                      value={billData.discountValue}
                      onChange={(e) => setBillData(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                    />
                    <span className="w-24 text-right font-medium">₹ {billData.discountAmount.toFixed(2)}</span>
                  </div>

                  <Separator />

                  {/* Net Amount (without round-off) */}
                  <div className="flex justify-between text-sm font-medium">
                    <span>Net Amount (Gross - Discount)</span>
                    <span>₹ {billData.netAmount.toFixed(2)}</span>
                  </div>

                  {/* Round Off */}
                  {billData.roundOff && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="roundOff"
                          checked={billData.roundOff}
                          onChange={(e) => setBillData(prev => ({ ...prev, roundOff: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="roundOff" className="font-normal cursor-pointer">
                          Round off adjustment
                        </Label>
                      </div>
                      <span className="font-medium">
                        {(billData.roundOffAmount >= 0 ? '+' : '') + billData.roundOffAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Show checkbox when not enabled */}
                  {!billData.roundOff && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        id="roundOff"
                        checked={billData.roundOff}
                        onChange={(e) => setBillData(prev => ({ ...prev, roundOff: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="roundOff" className="font-normal cursor-pointer">
                        Apply round off
                      </Label>
                    </div>
                  )}

                  <Separator />

                  {/* Final Payable Amount */}
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Final Payable Amount</span>
                    <span>₹ {(billData.netAmount + billData.roundOffAmount).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spacer for better scroll */}
            <div className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBill;
