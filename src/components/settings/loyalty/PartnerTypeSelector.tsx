
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { LoyaltyPartner } from "@/types/rewards";
import { PartnerType } from "./partnerData";

interface PartnerTypeSelectorProps {
  form: UseFormReturn<LoyaltyPartner>;
  onTypeChange: (type: PartnerType) => void;
}

const PartnerTypeSelector: React.FC<PartnerTypeSelectorProps> = ({ 
  form, 
  onTypeChange 
}) => {
  const handleTypeChange = (value: string) => {
    onTypeChange(value as PartnerType);
  };

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Partner Type</FormLabel>
          <Select 
            onValueChange={handleTypeChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select partner type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="airline">Airline</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="car">Car Rental</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PartnerTypeSelector;
