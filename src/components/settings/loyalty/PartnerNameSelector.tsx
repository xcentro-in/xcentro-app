
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { LoyaltyPartner } from "@/types/rewards";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface PartnerNameSelectorProps {
  form: UseFormReturn<LoyaltyPartner>;
  suggestions: { value: string, label: string }[];
  onPartnerSelect: (value: string, label: string) => void;
}

const PartnerNameSelector: React.FC<PartnerNameSelectorProps> = ({ 
  form, 
  suggestions = [], 
  onPartnerSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  
  // Update filtered suggestions when search term or suggestions change
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSuggestions(suggestions);
    } else {
      const filtered = suggestions.filter(
        (partner) => partner.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
  }, [searchTerm, suggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(true);
    
    // If the input is cleared, also clear the form value
    if (value === "") {
      form.setValue("name", "");
    }
  };

  const handleSelectPartner = (value: string, label: string) => {
    onPartnerSelect(value, label);
    setSearchTerm(label);
    setShowResults(false);
  };

  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Partner Name</FormLabel>
          <div className="relative">
            <FormControl>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search partner name"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() => setShowResults(true)}
                  onBlur={() => {
                    // Delay hiding results to allow for click
                    setTimeout(() => setShowResults(false), 200);
                  }}
                  className="pl-9"
                />
              </div>
            </FormControl>
            
            {showResults && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((partner) => (
                    <div 
                      key={partner.value} 
                      className={cn(
                        "p-2 flex items-center justify-between hover:bg-accent cursor-pointer",
                        field.value === partner.label && "bg-accent/50"
                      )}
                      onClick={() => handleSelectPartner(partner.value, partner.label)}
                    >
                      <div>{partner.label}</div>
                      {field.value === partner.label && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-muted-foreground">No partners found</div>
                )}
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PartnerNameSelector;
