
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
  role: z.string().min(1, { message: "Please select a role" }),
  department: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

interface InviteUserFormProps {
  onInviteSubmit: (values: InviteFormValues) => void;
}

const InviteUserForm = ({ onInviteSubmit }: InviteUserFormProps) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "",
      department: "",
    },
  });
  
  const onSubmit = (values: InviteFormValues) => {
    onInviteSubmit(values);
    toast.success("Invitation sent successfully");
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Invite New User</h3>
        <p className="text-sm text-muted-foreground">
          Send an invitation to a new team member to join your organization
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
                    <Input placeholder="John Doe" {...field} />
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
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
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
            
            <FormField
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
            />
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
          
          <div className="flex justify-end">
            <Button type="submit" className="mt-4">
              <UserPlus className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InviteUserForm;
