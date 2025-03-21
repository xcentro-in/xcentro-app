
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoyaltyPartner } from "@/types/rewards";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import AddPartnerModal from "./loyalty/AddPartnerModal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (partnerId: string) => {
    setEditingPartnerId(partnerId);
  };

  const handleSave = (data: LoyaltyPartner) => {
    onSavePartner(data);
    toast.success(`Partner ${data.name} saved successfully!`);
    setIsModalOpen(false);
    setEditingPartnerId(null);
  };

  const handleCancel = () => {
    setEditingPartnerId(null);
  };

  const handleDelete = (partnerId: string) => {
    onDeletePartner(partnerId);
    toast.success("Partner deleted successfully");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Loyalty Program Partners</CardTitle>
          <CardDescription>
            Link your loyalty accounts for seamless points conversion
          </CardDescription>
        </div>
        <Button onClick={handleOpenModal} className="h-9 gap-1">
          <Plus className="h-4 w-4" /> Add Partner
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedPartners.length === 0 ? (
          <EmptyPartnerState onAddNew={handleOpenModal} />
        ) : (
          <PartnerDisplayList
            partners={savedPartners}
            editingPartnerId={editingPartnerId}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />
        )}

        <AddPartnerModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onSave={handleSave} 
        />
      </CardContent>
    </Card>
  );
};

export default LoyaltyPartnersSettings;
