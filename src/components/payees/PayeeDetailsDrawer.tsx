
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Payee, BankPayee, BillerPayee, PayrollPayee } from "@/types/payee"
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
    navigate(`/payees/${payeeId}`);
    onClose();
  };

  const renderPayeeSpecificDetails = () => {
    switch (payee.type) {
      case "bank":
        const bankPayee = payee as BankPayee
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
      case "payroll":
        const payrollPayee = payee as PayrollPayee
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
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh]">
        <div className="mx-auto w-full max-w-4xl p-6">
          <DrawerHeader className="pb-6">
            <DrawerTitle>{payee.name}</DrawerTitle>
          </DrawerHeader>

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
        </div>
      </DrawerContent>
    </Drawer>
  )
}
