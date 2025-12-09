import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVendors } from "@/hooks/useVendors";
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { useAuth } from "@/contexts/AuthContext";

interface PayeeAutocompleteInputProps {
  selectedPayee?: string;
  onPayeeSelect: (payeeId: string) => void;
  favoritePayees?: string[];
  className?: string;
  error?: string;
  onAddNewVendor?: () => void;
}

const PayeeAutocompleteInput = ({
  selectedPayee,
  onPayeeSelect,
  favoritePayees = [],
  className,
  error,
  onAddNewVendor
}: PayeeAutocompleteInputProps) => {
  const { user } = useAuth();
  const { businessId, businessName } = useCurrentBusiness();
  const { vendors, isLoading, error: vendorsError } = useVendors(businessId);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedPayeeDetails = selectedPayee
    ? vendors.find(v => v.relation_id === selectedPayee)
    : null;

  const filteredPayees = vendors.filter(vendor =>
    vendor.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by favorites first, then by name
  const sortedPayees = filteredPayees.sort((a, b) => {
    const aIsFavorite = favoritePayees.includes(a.relation_id);
    const bIsFavorite = favoritePayees.includes(b.relation_id);

    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return a.display_name.localeCompare(b.display_name);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        setFocusedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < sortedPayees.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && sortedPayees[focusedIndex]) {
          handlePayeeSelect(sortedPayees[focusedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handlePayeeSelect = (vendor: { relation_id: string; display_name: string; contact_email: string }) => {
    onPayeeSelect(vendor.relation_id);
    setIsOpen(false);
    setSearchTerm("");
    setFocusedIndex(-1);
  };

  const displayValue = selectedPayeeDetails
    ? selectedPayeeDetails.display_name
    : searchTerm;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (selectedPayee) onPayeeSelect("");
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search and select payee..."
          className={cn(
            "flex h-14 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-base ring-offset-background transition-all duration-200",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />}
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </div>
      </div>

      {error && (
        <div className="mt-1 text-sm text-destructive">{error}</div>
      )}

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
              Loading vendors...
            </div>
          ) : vendorsError ? (
            <div className="p-3 text-sm text-destructive text-center">
              {vendorsError}
            </div>
          ) : sortedPayees.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              No vendors found
            </div>
          ) : (
            sortedPayees.map((vendor, index) => (
              <div
                key={vendor.relation_id}
                onClick={() => handlePayeeSelect(vendor)}
                className={cn(
                  "flex items-center gap-3 p-3 cursor-pointer transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  focusedIndex === index && "bg-accent text-accent-foreground",
                  selectedPayee === vendor.relation_id && "bg-primary/10 text-primary"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium truncate">{vendor.display_name}</div>
                    {favoritePayees.includes(vendor.relation_id) && (
                      <div className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                        Favorite
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {vendor.contact_email}
                  </div>
                </div>
                {selectedPayee === vendor.relation_id && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </div>
            ))
          )}
          
          <div className="border-t border-border">
            <div
              className="flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground text-primary"
              onClick={() => {
                setIsOpen(false);
                if (onAddNewVendor) {
                  onAddNewVendor();
                }
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">Add New Vendor</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayeeAutocompleteInput;