
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, Plane, Hotel, Car, Grid3X3 } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredPartners = partners.filter(partner => {
    if (activeTab === "all") return true;
    return partner.type === activeTab;
  });

  const renderPartnerCard = (partner: LoyaltyPartner) => {
    if (editingPartnerId === partner.id) {
      return (
        <div key={partner.id} className="col-span-1">
          <LoyaltyPartnerForm
            initialData={partner}
            onSave={onSave}
            onCancel={onCancel}
          />
        </div>
      );
    }

    return (
      <Card key={partner.id} className="col-span-1">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
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
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {partner.type.charAt(0).toUpperCase() + partner.type.slice(1)} Partner
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const getTabIcon = (type: string) => {
    switch (type) {
      case "airline":
        return <Plane className="h-4 w-4 mr-2" />;
      case "hotel":
        return <Hotel className="h-4 w-4 mr-2" />;
      case "car":
        return <Car className="h-4 w-4 mr-2" />;
      default:
        return <Grid3X3 className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="flex items-center">
            <Grid3X3 className="h-4 w-4 mr-2" /> All
          </TabsTrigger>
          <TabsTrigger value="airline" className="flex items-center">
            <Plane className="h-4 w-4 mr-2" /> Flights
          </TabsTrigger>
          <TabsTrigger value="hotel" className="flex items-center">
            <Hotel className="h-4 w-4 mr-2" /> Hotels
          </TabsTrigger>
          <TabsTrigger value="car" className="flex items-center">
            <Car className="h-4 w-4 mr-2" /> Car Rentals
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPartners.map(renderPartnerCard)}
          </div>
          {filteredPartners.length === 0 && (
            <div className="text-center p-6 border border-dashed rounded-md">
              <p className="text-muted-foreground">No {activeTab !== "all" ? activeTab : ""} partners found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnerDisplayList;
