
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoyaltyPartner } from "@/types/rewards";
import { X } from "lucide-react";
import { PartnerType, partnerSuggestions, getDefaultPartnerValues, getCategoryFromType } from "./loyalty/partnerData";
import PartnerTypeSelector from "./loyalty/PartnerTypeSelector";
import PartnerNameSelector from "./loyalty/PartnerNameSelector";
import MembershipDetailsForm from "./loyalty/MembershipDetailsForm";

interface LoyaltyPartnerFormProps {
  initialData?: LoyaltyPartner;
  onSave: (partner: LoyaltyPartner) => void;
  onCancel: () => void;
}

const LoyaltyPartnerForm: React.FC<LoyaltyPartnerFormProps> = ({ 
  initialData, 
  onSave, 
  onCancel 
}) => {
  const [selectedType, setSelectedType] = useState<PartnerType>(
    (initialData?.type as PartnerType) || "airline"
  );
  const [currentSuggestions, setCurrentSuggestions] = useState<{value: string, label: string}[]>([]);
  const [open, setOpen] = useState(false);
  
  const form = useForm<LoyaltyPartner>({
    defaultValues: initialData || getDefaultPartnerValues()
  });

  useEffect(() => {
    if (selectedType && partnerSuggestions[selectedType]) {
      setCurrentSuggestions(partnerSuggestions[selectedType]);
    } else {
      setCurrentSuggestions([]);
    }
  }, [selectedType]);

  const handleTypeChange = (type: PartnerType) => {
    setSelectedType(type);
    form.setValue("type", type);
    form.setValue("category", getCategoryFromType(type));
  };

  const handlePartnerSelect = (value: string, label: string) => {
    form.setValue("name", label);
    setOpen(false);
  };

  const handleSubmit = (data: LoyaltyPartner) => {
    onSave({
      ...data,
      conversionRatio: initialData?.conversionRatio || 0.5
    });
  };

  return (
    <Card className="border rounded-md p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{initialData ? "Edit Partner" : "Add New Partner"}</h3>
            <Button 
              variant="ghost"
              size="sm"
              type="button"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <PartnerTypeSelector form={form} onTypeChange={handleTypeChange} />

          {selectedType && (
            <PartnerNameSelector 
              form={form} 
              suggestions={currentSuggestions}
              open={open}
              setOpen={setOpen}
              onPartnerSelect={handlePartnerSelect}
            />
          )}

          {selectedType && form.watch("name") && (
            <MembershipDetailsForm form={form} />
          )}
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
            <Button 
              type="submit"
              disabled={!selectedType || !form.watch("name")}
            >
              Save Partner
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default LoyaltyPartnerForm;
