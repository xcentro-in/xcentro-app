
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { LoyaltyPartner } from "@/types/rewards";
import LoyaltyPartnerForm from "../LoyaltyPartnerForm";

interface PartnerDisplayListProps {
  partners: LoyaltyPartner[];
  editingPartnerId: string | null;
  onEdit: (partnerId: string) => void;
  onSave: (data: LoyaltyPartner) => void;
  onCancel: () => void;
  onDelete: (partnerId: string) => void;
}

const PartnerDisplayList: React.FC<PartnerDisplayListProps> = ({
  partners,
  editingPartnerId,
  onEdit,
  onSave,
  onCancel,
  onDelete
}) => {
  return (
    <div className="space-y-3">
      {partners.map((partner) => (
        <div key={partner.id} className="flex items-center justify-between p-3 rounded-md border">
          {editingPartnerId === partner.id ? (
            <LoyaltyPartnerForm
              initialData={partner}
              onSave={onSave}
              onCancel={onCancel}
            />
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center font-semibold text-sm">
                  {partner.name.substring(0, 2)}
                </div>
                <div>
                  <div className="font-medium">{partner.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {partner.membershipDetails?.membershipNumber || "No membership number"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => onEdit(partner.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onDelete(partner.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default PartnerDisplayList;
