
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContactDetailsFormProps {
  formData: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    email: string;
    phone: string;
  };
  updateFormData: (data: Partial<ContactDetailsFormProps['formData']>) => void;
}

const ContactDetailsForm = ({ formData, updateFormData }: ContactDetailsFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Contact Information</h2>
        <p className="text-muted-foreground text-sm">
          Please provide your contact details
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            placeholder="Enter your address"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => updateFormData({ city: e.target.value })}
              placeholder="Enter city"
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => updateFormData({ state: e.target.value })}
              placeholder="Enter state"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => updateFormData({ country: e.target.value })}
              placeholder="Enter country"
            />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => updateFormData({ postalCode: e.target.value })}
              placeholder="Enter postal code"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            placeholder="Enter your phone number"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsForm;
