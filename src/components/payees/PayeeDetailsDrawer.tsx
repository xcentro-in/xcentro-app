
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Payee, VendorPayee, BillerPayee, EmployeePayee } from "@/types/payee"
import { getPayeeTypeLabel } from "@/utils/payeeUtils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye, History, Trash } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PayeeDetailsDrawerProps {
  payee: Payee | null
  isOpen: boolean
  onClose: () => void
  onDelete: (id: string) => void
}

export const PayeeDetailsDrawer = ({
  payee,
  isOpen,
  onClose,
  onDelete,
}: PayeeDetailsDrawerProps) => {
  const navigate = useNavigate()

  if (!payee) return null

  const handleViewHistory = (payeeId: string) => {
    navigate(`/payees/${payeeId}?tab=history`);
    onClose();
  };

  const renderPayeeSpecificDetails = () => {
    switch (payee.type) {
      case "vendor":
        const bankPayee = payee as VendorPayee
        return (
          <>
            <div className="space-y-1">
              <p className="text-sm font-medium">Bank Details</p>
              <p className="text-sm text-muted-foreground">
                Account: {bankPayee.accountNumber}<br />
                IFSC: {bankPayee.ifscCode}<br />
                Bank: {bankPayee.bankName}
              </p>
            </div>
            {bankPayee.gstin && (
              <div className="space-y-1">
                <p className="text-sm font-medium">GST Details</p>
                <p className="text-sm text-muted-foreground">
                  GSTIN: {bankPayee.gstin}
                </p>
              </div>
            )}
          </>
        )
      case "biller":
        const billerPayee = payee as BillerPayee
        return (
          <div className="space-y-1">
            <p className="text-sm font-medium">Biller Details</p>
            <p className="text-sm text-muted-foreground">
              Biller ID: {billerPayee.customerId}<br />
              Category: {billerPayee.billerName}<br />
              Billing Cycle: {billerPayee.billingCycle}
            </p>
          </div>
        )
      case "employee":
        const payrollPayee = payee as EmployeePayee
        return (
          <div className="space-y-1">
            <p className="text-sm font-medium">Bank Details</p>
            <p className="text-sm text-muted-foreground">
              Account: {payrollPayee.accountNumber}<br />
              IFSC: {payrollPayee.ifscCode}<br />
              Bank: {payrollPayee.bankName}
            </p>
          </div>
        )
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle>{payee.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {getPayeeTypeLabel(payee.type)}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Contact Information</p>
            <p className="text-sm text-muted-foreground">
              Email: {payee.email}<br />
              Phone: {payee.contactNumber}
            </p>
          </div>

          {renderPayeeSpecificDetails()}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" size="sm" onClick={() => handleViewHistory(payee.id)}>
              <History className="h-4 w-4 mr-2" />
              View History
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive"
              onClick={() => {
                onDelete(payee.id);
                onClose();
              }}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
