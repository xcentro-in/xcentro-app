
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { LoyaltyPartner } from "@/types/rewards";

interface MembershipDetailsFormProps {
  form: UseFormReturn<LoyaltyPartner>;
}

const MembershipDetailsForm: React.FC<MembershipDetailsFormProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="membershipDetails.membershipNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Membership Number</FormLabel>
            <FormControl>
              <Input placeholder="ABC1234567" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="membershipDetails.registeredName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registered Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="membershipDetails.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registered Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default MembershipDetailsForm;
