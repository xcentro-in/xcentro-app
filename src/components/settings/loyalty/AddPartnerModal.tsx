
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoyaltyPartner } from "@/types/rewards";
import { Link } from "lucide-react";
import { PartnerType, partnerSuggestions, getDefaultPartnerValues, getCategoryFromType } from "./partnerData";
import PartnerTypeSelector from "./PartnerTypeSelector";
import PartnerNameSelector from "./PartnerNameSelector";
import MembershipIDField from "./MembershipIDField";

interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: LoyaltyPartner) => void;
}

const AddPartnerModal: React.FC<AddPartnerModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [selectedType, setSelectedType] = useState<PartnerType>("airline");
  const [selectedPartnerName, setSelectedPartnerName] = useState<string>("");
  const [open, setOpen] = useState(false);
  
  const form = useForm<LoyaltyPartner>({
    defaultValues: getDefaultPartnerValues()
  });

  const handleTypeChange = (type: PartnerType) => {
    setSelectedType(type);
    form.setValue("type", type);
    form.setValue("category", getCategoryFromType(type));
    // Clear the partner name when type changes
    form.setValue("name", "");
    setSelectedPartnerName("");
  };

  const handlePartnerSelect = (value: string, label: string) => {
    form.setValue("name", label);
    setSelectedPartnerName(label);
    setOpen(false);
  };

  const handleSubmit = (data: LoyaltyPartner) => {
    onSave({
      ...data,
      conversionRatio: 0.5
    });
    form.reset(getDefaultPartnerValues());
    setSelectedPartnerName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Partner</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <PartnerTypeSelector form={form} onTypeChange={handleTypeChange} />
            
            <PartnerNameSelector 
              form={form} 
              suggestions={partnerSuggestions[selectedType] || []}
              open={open}
              setOpen={setOpen}
              onPartnerSelect={handlePartnerSelect}
            />

            <MembershipIDField 
              form={form} 
              isDisabled={!selectedPartnerName}
            />
            
            <DialogFooter className="pt-4">
              <Button onClick={onClose} variant="outline" type="button">Cancel</Button>
              <Button 
                type="submit"
                disabled={!form.watch("name") || !form.watch("membershipDetails.membershipNumber")}
                className="gap-2"
              >
                <Link className="h-4 w-4" />
                Connect My Account to Partner
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPartnerModal;
