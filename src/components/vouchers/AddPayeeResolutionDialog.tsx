import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus } from "lucide-react";
import { voucherAPI } from "@/services/api";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface AddPayeeResolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
  /** Pre-filled from extraction draft */
  defaultVendorName?: string;
  /** Pre-filled from extraction draft */
  defaultGstin?: string;
  /** Called after successful payee creation */
  onPayeeCreated: (payeeId: string, displayName: string, gstin?: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

const AddPayeeResolutionDialog = ({
  open,
  onOpenChange,
  businessId,
  defaultVendorName = "",
  defaultGstin = "",
  onPayeeCreated,
}: AddPayeeResolutionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState(defaultVendorName);
  const [gstin, setGstin] = useState(defaultGstin);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      toast.error("Vendor name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await (voucherAPI as any).quickCreateVendor(businessId, {
        display_name: displayName.trim(),
        gstin: gstin.trim() || undefined,
        contact_email: contactEmail.trim() || undefined,
        contact_phone: contactPhone.trim() || undefined,
      });

      const newPayeeId = resp?.data?.payee_id ?? resp?.payee_id ?? "";
      toast.success("Payee created successfully");
      onPayeeCreated(newPayeeId, displayName.trim(), gstin.trim() || undefined);
      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to create payee:", err);
      toast.error("Failed to create payee", {
        description: err?.message ?? "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Add New Payee
          </DialogTitle>
          <DialogDescription>
            This vendor was not found in your payee directory. Fill in the
            details below to create a new payee and link it to this document.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Display Name */}
          <div>
            <Label htmlFor="add-payee-name">
              Vendor Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="add-payee-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Legal entity name"
              className="mt-1.5"
            />
          </div>

          {/* GSTIN */}
          <div>
            <Label htmlFor="add-payee-gstin">GSTIN</Label>
            <Input
              id="add-payee-gstin"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              placeholder="e.g. 27AADCB2230M1ZV"
              maxLength={15}
              className="mt-1.5 font-mono"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="add-payee-email">Contact Email</Label>
            <Input
              id="add-payee-email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="vendor@example.com"
              className="mt-1.5"
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="add-payee-phone">Contact Phone</Label>
            <Input
              id="add-payee-phone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="mt-1.5"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create Payee
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPayeeResolutionDialog;
