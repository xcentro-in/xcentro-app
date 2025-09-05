import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockPayees } from "@/data/mockPayees";
import { Payee } from "@/types/payee";
import { getPayeeIcon } from "@/utils/payeeUtils";

interface PayeeAutocompleteInputProps {
  selectedPayee?: string;
  onPayeeSelect: (payeeId: string) => void;
  favoritePayees?: string[];
  className?: string;
  error?: string;
}

const PayeeAutocompleteInput = ({
  selectedPayee,
  onPayeeSelect,
  favoritePayees = [],
  className,
  error
}: PayeeAutocompleteInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedPayeeDetails = selectedPayee ? mockPayees.find(p => p.id === selectedPayee) : null;

  const filteredPayees = mockPayees.filter(payee =>
    payee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by favorites first, then by name
  const sortedPayees = filteredPayees.sort((a, b) => {
    const aIsFavorite = favoritePayees.includes(a.id);
    const bIsFavorite = favoritePayees.includes(b.id);
    
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return a.name.localeCompare(b.name);
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

  const handlePayeeSelect = (payee: Payee) => {
    onPayeeSelect(payee.id);
    setIsOpen(false);
    setSearchTerm("");
    setFocusedIndex(-1);
  };

  const displayValue = selectedPayeeDetails 
    ? selectedPayeeDetails.name 
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
          {selectedPayeeDetails && getPayeeIcon(selectedPayeeDetails.type)}
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
          {sortedPayees.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              No payees found
            </div>
          ) : (
            sortedPayees.map((payee, index) => (
              <div
                key={payee.id}
                onClick={() => handlePayeeSelect(payee)}
                className={cn(
                  "flex items-center gap-3 p-3 cursor-pointer transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  focusedIndex === index && "bg-accent text-accent-foreground",
                  selectedPayee === payee.id && "bg-primary/10 text-primary"
                )}
              >
                <div className="flex-shrink-0">
                  {getPayeeIcon(payee.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium truncate">{payee.name}</div>
                    {favoritePayees.includes(payee.id) && (
                      <div className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                        Favorite
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {payee.email}
                  </div>
                </div>
                {selectedPayee === payee.id && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </div>
            ))
          )}
          
          <div className="border-t border-border">
            <div
              className="flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground text-primary"
              onClick={() => {
                // TODO: Open add payee dialog
                setIsOpen(false);
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">Add New Payee</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayeeAutocompleteInput;