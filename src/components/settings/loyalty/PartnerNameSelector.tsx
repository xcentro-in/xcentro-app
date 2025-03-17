
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import { LoyaltyPartner } from "@/types/rewards";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PartnerNameSelectorProps {
  form: UseFormReturn<LoyaltyPartner>;
  suggestions: { value: string, label: string }[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onPartnerSelect: (value: string, label: string) => void;
}

const PartnerNameSelector: React.FC<PartnerNameSelectorProps> = ({ 
  form, 
  suggestions,
  open,
  setOpen,
  onPartnerSelect
}) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Partner Name</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? field.value
                    : "Select partner"}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search partner..." />
                <CommandEmpty>No partner found.</CommandEmpty>
                <CommandGroup>
                  {suggestions.map((partner) => (
                    <CommandItem
                      key={partner.value}
                      value={partner.value}
                      onSelect={() => onPartnerSelect(partner.value, partner.label)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === partner.label
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {partner.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PartnerNameSelector;
