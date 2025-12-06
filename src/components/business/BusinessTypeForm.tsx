
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { businessTypes, businessModels, turnoverRanges } from "@/data/mockBusinesses";

interface BusinessTypeFormProps {
  formData: {
    type: string;
    model: string;
    turnover: string;
  };
  updateFormData: (field: string, value: any) => void;
}

const formSchema = z.object({
  type: z.string().min(1, { message: "Please select a business type." }),
  model: z.string().min(1, { message: "Please select a business model." }),
  turnover: z.string().min(1, { message: "Please select a turnover range." }),
});

const BusinessTypeForm = ({ formData, updateFormData }: BusinessTypeFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: formData.type || "",
      model: formData.model || "",
      turnover: formData.turnover || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // This will be handled by the parent component
  };

  // Sync form values when formData prop changes (e.g., from pre-fill)
  useEffect(() => {
    if (formData.type || formData.model || formData.turnover) {
      form.reset({
        type: formData.type || "",
        model: formData.model || "",
        turnover: formData.turnover || "",
      });
    }
  }, [formData.type, formData.model, formData.turnover, form]);

  // Update parent form data when this form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.type !== undefined) updateFormData("type", value.type);
      if (value.model !== undefined) updateFormData("model", value.model);
      if (value.turnover !== undefined) updateFormData("turnover", value.turnover);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Business Classification</h2>
        <p className="text-muted-foreground text-sm">
          Select the appropriate classification for your business
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Model</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business model" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="turnover"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Turnover</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select turnover range" />
                    </SelectTrigger>
                    <SelectContent>
                      {turnoverRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default BusinessTypeForm;
