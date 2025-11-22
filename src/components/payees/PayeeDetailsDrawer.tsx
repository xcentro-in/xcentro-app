
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Payee, VendorPayee, BillerPayee, EmployeePayee } from "@/types/payee"
import { getPayeeTypeLabel } from "@/utils/payeeUtils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye, History, Ban, CheckCircle, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { payeesAPI } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"

interface PayeeDetailsDrawerProps {
  payee: Payee | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, isActive: boolean) => void
}

export const PayeeDetailsDrawer = ({
  payee,
  isOpen,
  onClose,
  onStatusChange,
}: PayeeDetailsDrawerProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // State for account details
  const [accountDetails, setAccountDetails] = useState<{
    account_number_last_4: string;
    bank_name: string;
    ifsc_code: string;
  } | null>(null)
  const [isLoadingAccDetails, setIsLoadingAccDetails] = useState(false)
  const [accDetailsError, setAccDetailsError] = useState<string | null>(null)

  // Fetch account details when drawer opens for vendor/employee types
  useEffect(() => {
    const fetchAccountDetails = async () => {
      // Only fetch for vendor and employee types
      if (!payee || !isOpen || (payee.type !== 'vendor' && payee.type !== 'employee')) {
        return;
      }

      if (!user?.businessId) {
        setAccDetailsError("Business ID not available");
        return;
      }

      setIsLoadingAccDetails(true);
      setAccDetailsError(null);

      try {
        const response = await payeesAPI.getAccountDetails(user.businessId, payee.id);
        setAccountDetails(response.data);
      } catch (error: any) {
        console.error("Failed to fetch account details:", error);
        setAccDetailsError(error.message || "Failed to load account details");
      } finally {
        setIsLoadingAccDetails(false);
      }
    };

    fetchAccountDetails();

    // Reset state when drawer closes
    if (!isOpen) {
      setAccountDetails(null);
      setAccDetailsError(null);
    }
  }, [payee?.id, isOpen, payee?.type, user?.businessId]);

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
              {isLoadingAccDetails ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading account details...
                </div>
              ) : accDetailsError ? (
                <p className="text-sm text-destructive">{accDetailsError}</p>
              ) : accountDetails ? (
                <p className="text-sm text-muted-foreground">
                  Account: ****{accountDetails.account_number_last_4}<br />
                  IFSC: {accountDetails.ifsc_code}<br />
                  Bank: {accountDetails.bank_name}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">No account details available</p>
              )}
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
            {isLoadingAccDetails ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading account details...
              </div>
            ) : accDetailsError ? (
              <p className="text-sm text-destructive">{accDetailsError}</p>
            ) : accountDetails ? (
              <p className="text-sm text-muted-foreground">
                Account: ****{accountDetails.account_number_last_4}<br />
                IFSC: {accountDetails.ifsc_code}<br />
                Bank: {accountDetails.bank_name}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No account details available</p>
            )}
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
              className={payee.isActive ? "text-orange-600" : "text-green-600"}
              onClick={() => {
                onStatusChange(payee.id, !payee.isActive);
                onClose();
              }}
            >
              {payee.isActive ? (
                <>
                  <Ban className="h-4 w-4 mr-2" />
                  Mark Inactive
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Active
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
