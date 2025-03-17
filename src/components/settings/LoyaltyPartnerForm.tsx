import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { LoyaltyPartner } from "@/types/rewards";
import { X } from "lucide-react";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface LoyaltyPartnerFormProps {
  initialData?: LoyaltyPartner;
  onSave: (partner: LoyaltyPartner) => void;
  onCancel: () => void;
}

// Sample partner suggestions for each type
const partnerSuggestions = {
  airline: [
    { value: "emirates", label: "Emirates Skywards" },
    { value: "delta", label: "Delta SkyMiles" },
    { value: "airIndia", label: "Air India Flying Returns" },
    { value: "united", label: "United MileagePlus" },
    { value: "lufthansa", label: "Lufthansa Miles & More" },
    { value: "british", label: "British Airways Executive Club" },
  ],
  hotel: [
    { value: "marriott", label: "Marriott Bonvoy" },
    { value: "hilton", label: "Hilton Honors" },
    { value: "hyatt", label: "World of Hyatt" },
    { value: "ihg", label: "IHG One Rewards" },
    { value: "accor", label: "Accor Live Limitless" },
    { value: "radisson", label: "Radisson Rewards" },
  ],
  car: [
    { value: "hertz", label: "Hertz Gold Plus Rewards" },
    { value: "avis", label: "Avis Preferred" },
    { value: "enterprise", label: "Enterprise Plus" },
    { value: "budget", label: "Budget Fastbreak" },
  ],
  other: [
    { value: "amex", label: "American Express Membership Rewards" },
    { value: "chase", label: "Chase Ultimate Rewards" },
    { value: "starbucks", label: "Starbucks Rewards" },
    { value: "target", label: "Target Circle" },
  ]
};

const LoyaltyPartnerForm: React.FC<LoyaltyPartnerFormProps> = ({ 
  initialData, 
  onSave, 
  onCancel 
}) => {
  const [selectedType, setSelectedType] = useState<string>(initialData?.type || "");
  const [currentSuggestions, setCurrentSuggestions] = useState<{value: string, label: string}[]>([]);
  const [open, setOpen] = useState(false);
  
  const form = useForm<LoyaltyPartner>({
    defaultValues: initialData || {
      id: `partner-${Date.now()}`,
      name: "",
      type: "",
      conversionRatio: 0.5, // Default value, but removed from UI
      category: "",
      membershipDetails: {
        membershipNumber: "",
        registeredName: "",
        email: ""
      }
    }
  });

  // Update suggestions when type changes
  useEffect(() => {
    if (selectedType && partnerSuggestions[selectedType as keyof typeof partnerSuggestions]) {
      setCurrentSuggestions(partnerSuggestions[selectedType as keyof typeof partnerSuggestions]);
    } else {
      setCurrentSuggestions([]);
    }
  }, [selectedType]);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    form.setValue("type", value);
    
    // Set category based on type
    switch(value) {
      case "airline":
        form.setValue("category", "flights");
        break;
      case "hotel":
        form.setValue("category", "hotels");
        break;
      case "car":
        form.setValue("category", "travel");
        break;
      default:
        form.setValue("category", "business");
    }
  };

  const handlePartnerSelect = (value: string, label: string) => {
    form.setValue("name", label);
    setOpen(false);
  };

  const handleSubmit = (data: LoyaltyPartner) => {
    // Keep conversionRatio even though it's not in the UI
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
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner Type</FormLabel>
                <Select 
                  onValueChange={(value) => handleTypeChange(value)} 
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
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedType && (
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
                          {currentSuggestions.map((partner) => (
                            <CommandItem
                              key={partner.value}
                              value={partner.value}
                              onSelect={() => handlePartnerSelect(partner.value, partner.label)}
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
          )}

          {selectedType && form.watch("name") && (
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
