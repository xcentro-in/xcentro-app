import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface KYCDetailsFormProps {
  formData: {
    name: string;
    aadharNumber: string;
    panNumber: string;
    dateOfBirth: string;
  };
  updateFormData: (data: Partial<KYCDetailsFormProps['formData']>) => void;
}

const KYCDetailsForm = ({ formData, updateFormData }: KYCDetailsFormProps) => {
  const [date, setDate] = useState<Date | undefined>(() => {
    if (formData.dateOfBirth) {
      const [day, month, year] = formData.dateOfBirth.split('-');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return undefined;
  });

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
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default KYCDetailsForm;
