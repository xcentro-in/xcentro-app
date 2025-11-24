import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  // Calculate date 18 years ago (minimum age requirement)
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

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
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
            max={eighteenYearsAgo.toISOString().split('T')[0]}
            min="1900-01-01"
          />
          <p className="text-xs text-muted-foreground mt-1">
            You must be at least 18 years old
          </p>
        </div>
      </div>
    </div>
  );
};

export default KYCDetailsForm;
