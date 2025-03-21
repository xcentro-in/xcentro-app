
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { LoyaltyPartner } from "@/types/rewards";

interface MembershipIDFieldProps {
  form: UseFormReturn<LoyaltyPartner>;
  isDisabled: boolean;
}

const MembershipIDField: React.FC<MembershipIDFieldProps> = ({ form, isDisabled }) => {
  return (
    <FormField
      control={form.control}
      name="membershipDetails.membershipNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Membership ID</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter your membership ID" 
              {...field} 
              disabled={isDisabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MembershipIDField;
