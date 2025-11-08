import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parse, parseISO, isValid } from "date-fns";

interface KYCDetailsFormProps {
  formData: {
    name: string;
    aadharNumber: string;
    panNumber: string;
    dateOfBirth: string;
  };
  updateFormData: (data: Partial<KYCDetailsFormProps['formData']>) => void;
}

// Helper function to parse date from either API ISO format or dd-MM-yyyy format
const parseDateOfBirth = (dobString: string): Date | undefined => {
  if (!dobString) return undefined;

  // Try parsing as ISO format first (from API)
  if (dobString.includes('T') || dobString.match(/^\d{4}-\d{2}-\d{2}/)) {
    const date = parseISO(dobString);
    if (isValid(date)) return date;
  }

  // Try parsing as dd-MM-yyyy format (from user input)
  const date = parse(dobString, 'dd-MM-yyyy', new Date());
  if (isValid(date)) return date;

  return undefined;
};

const KYCDetailsForm = ({ formData, updateFormData }: KYCDetailsFormProps) => {
  const [date, setDate] = useState<Date | undefined>(() => parseDateOfBirth(formData.dateOfBirth));

  // Update date when formData.dateOfBirth changes (e.g., when pre-filled from API)
  useEffect(() => {
    const parsedDate = parseDateOfBirth(formData.dateOfBirth);
    if (parsedDate && parsedDate.getTime() !== date?.getTime()) {
      setDate(parsedDate);

      // Normalize the date format to dd-MM-yyyy if it's in ISO format
      // This ensures formData.dateOfBirth is always in the expected format
      if (formData.dateOfBirth && (formData.dateOfBirth.includes('T') || formData.dateOfBirth.match(/^\d{4}-\d{2}-\d{2}/))) {
        const formatted = format(parsedDate, "dd-MM-yyyy");
        updateFormData({ dateOfBirth: formatted });
      }
    }
  }, [formData.dateOfBirth]);

  // Calculate date 18 years ago (minimum age requirement)
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  // Default to 30 years ago for better initial calendar position
  const defaultMonth = new Date();
  defaultMonth.setFullYear(defaultMonth.getFullYear() - 30);

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 12) value = value.slice(0, 12);
    
    if (value.length > 8) {
      value = value.slice(0, 4) + '-' + value.slice(4, 8) + '-' + value.slice(8);
    } else if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    
    updateFormData({ aadharNumber: value });
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    if (value.length > 10) value = value.slice(0, 10);
    updateFormData({ panNumber: value });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const formatted = format(selectedDate, "dd-MM-yyyy");
      updateFormData({ dateOfBirth: formatted });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">KYC Details</h2>
        <p className="text-muted-foreground text-sm">
          Please provide your details for verification
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="aadharNumber">Aadhar Number</Label>
            <Input
              id="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleAadharChange}
              placeholder="XXXX-XXXX-XXXX"
              maxLength={14}
            />
          </div>
          <div>
            <Label htmlFor="panNumber">PAN Number</Label>
            <Input
              id="panNumber"
              value={formData.panNumber}
              onChange={handlePanChange}
              placeholder="ABCDE1234F"
              maxLength={10}
              className="uppercase"
            />
          </div>
        </div>

        <div>
          <Label>Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd-MM-yyyy") : "Select date of birth"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => date > eighteenYearsAgo || date < new Date("1900-01-01")}
                initialFocus
                defaultMonth={date || defaultMonth}
                captionLayout="dropdown"
                fromYear={1900}
                toYear={eighteenYearsAgo.getFullYear()}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground mt-1">
            You must be at least 18 years old. Use the dropdowns to quickly select year and month.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KYCDetailsForm;
