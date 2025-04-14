
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProfileDetailsFormProps {
  formData: {
    name: string;
    kycStatus: "pending" | "verified" | "rejected";
  };
  updateFormData: (data: Partial<ProfileDetailsFormProps['formData']>) => void;
}

const ProfileDetailsForm = ({ formData, updateFormData }: ProfileDetailsFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Profile Details</h2>
        <p className="text-muted-foreground text-sm">
          Please provide your personal details
        </p>
      </div>

      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          placeholder="Enter your full name"
        />
      </div>
    </div>
  );
};

export default ProfileDetailsForm;
