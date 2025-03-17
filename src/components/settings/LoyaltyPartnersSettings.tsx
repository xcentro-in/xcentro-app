
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoyaltyPartner } from "@/types/rewards";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import LoyaltyPartnerForm from "./LoyaltyPartnerForm";

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
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-muted-foreground">No loyalty partners connected yet</p>
            <Button onClick={handleAddNew} className="mt-4">Add Your First Partner</Button>
          </div>
        )}

        {savedPartners.length > 0 && (
          <div className="space-y-3">
            {savedPartners.map((partner) => (
              <div key={partner.id} className="flex items-center justify-between p-3 rounded-md border">
                {editingPartnerId === partner.id ? (
                  <LoyaltyPartnerForm
                    initialData={partner}
                    onSave={handleSave}
                    onCancel={handleCancel}
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
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(partner.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(partner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
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
