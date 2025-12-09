
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, Send } from "lucide-react";
import { userRoleLabels, userRolePermissions } from "@/types/user";
import { toast } from "sonner";

const inviteFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  mobile: z.string()
    .regex(/^\d{10}$/, { message: "Mobile number must be exactly 10 digits" }),
  role: z.string().min(1, { message: "Please select a role" }),
  // department: z.string().optional(), // TODO: Implement department feature later
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

interface InviteUserFormProps {
  onInviteSubmit: (values: InviteFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  editMode?: boolean;
  editUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const InviteUserForm = ({ onInviteSubmit, onCancel, isSubmitting = false, editMode = false, editUser }: InviteUserFormProps) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(editUser?.role || null);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: editUser?.email || "",
      name: editUser?.name || "",
      mobile: "",
      role: editUser?.role || "",
      // department: "", // TODO: Implement department feature later
    },
  });

  const onSubmit = (values: InviteFormValues) => {
    onInviteSubmit(values);
    // Note: Don't show success toast here - parent component handles it after API call
    if (!editMode) {
      form.reset();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{editMode ? "Edit User" : "Invite New User"}</h3>
        <p className="text-sm text-muted-foreground">
          {editMode
            ? "Update the user's role and permissions"
            : "Send an invitation to a new team member to join your organization"}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} disabled={editMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} disabled={editMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      maxLength={10}
                      disabled={editMode}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">10-digit mobile number</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedRole(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(userRoleLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TODO: Implement department feature later */}
            {/* <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Finance, Marketing, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          
          {selectedRole && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">Permissions for {userRoleLabels[selectedRole]}:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {userRolePermissions[selectedRole].map((permission, index) => (
                  <li key={index}>{permission}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <UserPlus className="h-4 w-4 mr-2" />
              {isSubmitting
                ? (editMode ? "Saving..." : "Sending...")
                : (editMode ? "Save Changes" : "Send Invitation")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InviteUserForm;
