
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InvoiceDetails } from "@/types/invoice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  FileText, 
  Building, 
  DollarSign, 
  CalendarDays,
  Save,
  Check,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

interface ReviewInvoiceStepProps {
  invoiceDetails: InvoiceDetails;
  invoiceFile: File | null;
  onConfirm: (details: InvoiceDetails) => void;
  onBack: () => void;
}

const ReviewInvoiceStep = ({ 
  invoiceDetails: initialDetails, 
  invoiceFile,
  onConfirm, 
  onBack 
}: ReviewInvoiceStepProps) => {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails>(initialDetails);
  const [isVendorSaved, setIsVendorSaved] = useState(false);
  
  const handleInputChange = (field: keyof InvoiceDetails, value: string | number) => {
    setInvoiceDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveVendor = () => {
    // In a real app, this would save the vendor to the database
    setIsVendorSaved(true);
    toast.success("Vendor saved for future use");
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Review Invoice Details</h2>
          <p className="text-muted-foreground">
            Verify the extracted information and edit if necessary
          </p>
        </div>
        
        {invoiceFile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => {
              // This would normally open a modal with the invoice preview
              toast.info("Invoice preview feature coming soon");
            }}
          >
            <FileText className="h-4 w-4" />
            View Original Invoice
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={invoiceDetails.invoiceNumber}
              onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="vendorName">Vendor Name</Label>
              {!isVendorSaved && !invoiceDetails.matchedVendor && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto gap-1 text-xs"
                  onClick={handleSaveVendor}
                >
                  <Save className="h-3 w-3" />
                  Save as New Vendor
                </Button>
              )}
              {isVendorSaved && (
                <Badge variant="outline" className="flex gap-1 items-center">
                  <Check className="h-3 w-3" />
                  Saved
                </Badge>
              )}
              {invoiceDetails.matchedVendor && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Existing Vendor
                </Badge>
              )}
            </div>
            <Input
              id="vendorName"
              value={invoiceDetails.vendorName}
              onChange={(e) => handleInputChange('vendorName', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <div className="relative">
                <Input
                  id="invoiceDate"
                  value={invoiceDetails.invoiceDate}
                  onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                  type="date"
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  value={invoiceDetails.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  type="date"
                />
                <CalendarDays className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Amount</Label>
            <div className="relative">
              <Input
                id="totalAmount"
                value={invoiceDetails.totalAmount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) || e.target.value === '') {
                    handleInputChange('totalAmount', e.target.value === '' ? 0 : value);
                  }
                }}
                type="number"
                className="pl-8"
              />
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Invoice Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Number:</span>
                  <span>{invoiceDetails.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor:</span>
                  <span>{invoiceDetails.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Date:</span>
                  <span>{formatDate(invoiceDetails.invoiceDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{formatDate(invoiceDetails.dueDate)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total Amount:</span>
                  <span>₹{invoiceDetails.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {invoiceDetails.gstDetails && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">GST Details</h3>
                <div className="space-y-2 text-sm">
                  {invoiceDetails.gstDetails.cgst && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CGST:</span>
                      <span>₹{invoiceDetails.gstDetails.cgst.toLocaleString()}</span>
                    </div>
                  )}
                  {invoiceDetails.gstDetails.sgst && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SGST:</span>
                      <span>₹{invoiceDetails.gstDetails.sgst.toLocaleString()}</span>
                    </div>
                  )}
                  {invoiceDetails.gstDetails.igst && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IGST:</span>
                      <span>₹{invoiceDetails.gstDetails.igst.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total GST:</span>
                    <span>₹{invoiceDetails.gstDetails.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {invoiceDetails.paymentInstructions && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Payment Instructions</h3>
                <div className="space-y-2 text-sm">
                  {invoiceDetails.paymentInstructions.accountHolderName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Holder:</span>
                      <span>{invoiceDetails.paymentInstructions.accountHolderName}</span>
                    </div>
                  )}
                  {invoiceDetails.paymentInstructions.bankAccount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Number:</span>
                      <span>{invoiceDetails.paymentInstructions.bankAccount}</span>
                    </div>
                  )}
                  {invoiceDetails.paymentInstructions.ifscCode && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IFSC Code:</span>
                      <span>{invoiceDetails.paymentInstructions.ifscCode}</span>
                    </div>
                  )}
                  {invoiceDetails.paymentInstructions.upiId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">UPI ID:</span>
                      <span>{invoiceDetails.paymentInstructions.upiId}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <div className="pt-4 flex gap-3">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={() => onConfirm(invoiceDetails)}
          className="flex-1"
        >
          Confirm Details
        </Button>
      </div>
    </div>
  );
};

export default ReviewInvoiceStep;
