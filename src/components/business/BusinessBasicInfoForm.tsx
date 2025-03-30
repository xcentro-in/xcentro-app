
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";

interface BusinessBasicInfoFormProps {
  formData: {
    name: string;
    pan: string;
    gstin?: string;
  };
  updateFormData: (field: string, value: any) => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Business name must be at least 2 characters." }),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { 
    message: "PAN must be in the format ABCDE1234F." 
  }),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/, {
    message: "GSTIN must be in the format 29ABCDE1234F1Z2."
  }).optional().or(z.literal('')),
});

const BusinessBasicInfoForm = ({ formData, updateFormData }: BusinessBasicInfoFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData.name || "",
      pan: formData.pan || "",
      gstin: formData.gstin || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // This will be handled by the parent component
  };

  // Update parent form data when this form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.name !== undefined) updateFormData("name", value.name);
      if (value.pan !== undefined) updateFormData("pan", value.pan);
      if (value.gstin !== undefined) updateFormData("gstin", value.gstin);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Basic Information</h2>
        <p className="text-muted-foreground text-sm">
          Enter the basic details of your business as per official records
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name (as per PAN)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter business name" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business PAN</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="ABCDE1234F" 
                    {...field} 
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gstin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GSTIN (optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="29ABCDE1234F1Z2" 
                    {...field} 
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default BusinessBasicInfoForm;
