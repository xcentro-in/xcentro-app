
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoyaltyPartner } from "@/types/rewards";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import LoyaltyPartnerForm from "./LoyaltyPartnerForm";
import PartnerDisplayList from "./loyalty/PartnerDisplayList";
import EmptyPartnerState from "./loyalty/EmptyPartnerState";

interface LoyaltyPartnersSettingsProps {
  savedPartners: LoyaltyPartner[];
  onSavePartner: (partner: LoyaltyPartner) => void;
  onDeletePartner: (partnerId: string) => void;
}

const LoyaltyPartnersSettings: React.FC<LoyaltyPartnersSettingsProps> = ({ 
  savedPartners, 
  onSavePartner, 
  onDeletePartner 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  
  const handleAddNew = () => {
    setIsAdding(true);
  };

  const handleEdit = (partnerId: string) => {
    setEditingPartnerId(partnerId);
  };

  const handleSave = (data: LoyaltyPartner) => {
    onSavePartner(data);
    toast.success(`Partner ${data.name} saved successfully!`);
    setIsAdding(false);
    setEditingPartnerId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingPartnerId(null);
  };

  const handleDelete = (partnerId: string) => {
    onDeletePartner(partnerId);
    toast.success("Partner deleted successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Loyalty Program Partners</CardTitle>
        <CardDescription>
          Link your loyalty accounts for seamless points conversion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedPartners.length === 0 && !isAdding && (
          <EmptyPartnerState onAddNew={handleAddNew} />
        )}

        {savedPartners.length > 0 && (
          <PartnerDisplayList
            partners={savedPartners}
            editingPartnerId={editingPartnerId}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />
        )}

        {isAdding && (
          <LoyaltyPartnerForm
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {savedPartners.length > 0 && !isAdding && !editingPartnerId && (
          <Button onClick={handleAddNew} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add New Partner
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LoyaltyPartnersSettings;
