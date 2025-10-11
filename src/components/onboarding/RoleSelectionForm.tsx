import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoleSelectionFormProps {
  formData: {
    role: string;
  };
  updateFormData: (data: Partial<RoleSelectionFormProps['formData']>) => void;
}

const getRolePermissions = (role: string): string[] => {
  const permissions: Record<string, string[]> = {
    owner: [
      'Full super admin rights across the platform',
      'Manage all users and roles',
      'Full access to all financial data',
      'Manage payment methods and approve all transactions',
      'Access financial reports and configure system settings'
    ],
    admin: [
      'Rights to make changes across the platform',
      'Manage users (except business owners)',
      'Full access to financial data',
      'Manage payment methods and approve transactions',
      'Access financial reports and configure most settings'
    ],
    finance_manager: [
      'Approve expense payables (maker-checker)',
      'View all financial data',
      'Manage payment methods',
      'Create and approve transactions',
      'Access financial reports with limited settings access'
    ],
    accountant: [
      'View-only rights over bills and payments',
      'View financial data and create transactions',
      'Request transaction approvals',
      'Access basic reports',
      'No approval or settings access'
    ]
  };
  
  return permissions[role] || [];
};

const RoleSelectionForm = ({ formData, updateFormData }: RoleSelectionFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Select Your Role</h2>
        <p className="text-muted-foreground text-sm">
          Choose the role that best describes your responsibilities
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => updateFormData({ role: value })}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Business Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="finance_manager">Approver</SelectItem>
              <SelectItem value="accountant">Auditor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.role && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <h4 className="text-sm font-medium mb-2">Role Permissions</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {getRolePermissions(formData.role).map((permission, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{permission}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelectionForm;
