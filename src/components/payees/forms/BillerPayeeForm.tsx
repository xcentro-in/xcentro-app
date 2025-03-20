
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface BillerPayeeFormProps {
  onSubmit: () => void;
}

// Mock business/GSTIN data for demonstration
const mockBusinessData = [
  { id: "1", name: "Tata Power", gstin: "27AABCT3518Q1ZW" },
  { id: "2", name: "Airtel", gstin: "06AABCA1739L1ZK" },
  { id: "3", name: "Jio", gstin: "27AAACR5055K1ZK" },
  { id: "4", name: "BSES", gstin: "07AADCB2930M1ZG" },
];

const formSchema = z.object({
  payeeName: z.string().min(1, { message: "Payee name is required" }),
  businessInfo: z.string().min(1, { message: "Business selection is required" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  billerCode: z.string().min(1, { message: "Biller code is required" }),
  customerReferenceNumber: z.string().optional(),
  billingCycle: z.string(),
  autoPayment: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

const BillerPayeeForm = ({ onSubmit }: BillerPayeeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessSearchTerm, setBusinessSearchTerm] = useState("");
  const [billerSearchTerm, setBillerSearchTerm] = useState("");
  const [showBusinessResults, setShowBusinessResults] = useState(false);
  const [showBillerResults, setShowBillerResults] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payeeName: "",
      businessInfo: "",
      email: "",
      phoneNumber: "",
      billerCode: "",
      customerReferenceNumber: "",
      billingCycle: "monthly",
      autoPayment: false
    }
  });

  // Filter business data based on search term
  const filteredBusinesses = mockBusinessData.filter(
    business => 
      business.name.toLowerCase().includes(businessSearchTerm.toLowerCase()) ||
      business.gstin.toLowerCase().includes(businessSearchTerm.toLowerCase())
  );

  // For demo purposes, biller codes are the same as business data
  const filteredBillers = mockBusinessData.filter(
    biller => 
      biller.name.toLowerCase().includes(billerSearchTerm.toLowerCase()) ||
      biller.gstin.toLowerCase().includes(billerSearchTerm.toLowerCase())
  );

  const handleSelectBusiness = (business: typeof mockBusinessData[0]) => {
    form.setValue("businessInfo", business.id);
    setBusinessSearchTerm(business.name);
    setShowBusinessResults(false);
  };

  const handleSelectBiller = (biller: typeof mockBusinessData[0]) => {
    form.setValue("billerCode", biller.id);
    setBillerSearchTerm(biller.name);
    setShowBillerResults(false);
  };

  const handleFormSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Form submitted:", data);
      onSubmit();
    }, 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Payee Name */}
              <FormField
                control={form.control}
                name="payeeName"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Payee Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter payee name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Business Name/GSTIN */}
              <FormField
                control={form.control}
                name="businessInfo"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Business Name/GSTIN</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Search business name or GSTIN" 
                          value={businessSearchTerm}
                          onChange={(e) => {
                            setBusinessSearchTerm(e.target.value);
                            setShowBusinessResults(true);
                          }}
                          onFocus={() => setShowBusinessResults(true)}
                        />
                        {showBusinessResults && businessSearchTerm && (
                          <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredBusinesses.length > 0 ? (
                              filteredBusinesses.map(business => (
                                <div 
                                  key={business.id} 
                                  className="p-2 hover:bg-accent cursor-pointer"
                                  onClick={() => handleSelectBusiness(business)}
                                >
                                  <div className="font-medium">{business.name}</div>
                                  <div className="text-xs text-muted-foreground">GSTIN: {business.gstin}</div>
                                </div>
                              ))
                            ) : (
                              <div className="p-2 text-muted-foreground">No results found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Biller Code/Name */}
              <FormField
                control={form.control}
                name="billerCode"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Biller Code/Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Search biller code or name" 
                          value={billerSearchTerm}
                          onChange={(e) => {
                            setBillerSearchTerm(e.target.value);
                            setShowBillerResults(true);
                          }}
                          onFocus={() => setShowBillerResults(true)}
                        />
                        {showBillerResults && billerSearchTerm && (
                          <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredBillers.length > 0 ? (
                              filteredBillers.map(biller => (
                                <div 
                                  key={biller.id} 
                                  className="p-2 hover:bg-accent cursor-pointer"
                                  onClick={() => handleSelectBiller(biller)}
                                >
                                  <div className="font-medium">{biller.name}</div>
                                  <div className="text-xs text-muted-foreground">Code: {biller.gstin}</div>
                                </div>
                              ))
                            ) : (
                              <div className="p-2 text-muted-foreground">No results found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Customer Reference Number */}
              <FormField
                control={form.control}
                name="customerReferenceNumber"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Customer Reference Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer reference number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Billing Cycle */}
              <FormField
                control={form.control}
                name="billingCycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Cycle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select billing cycle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="one-time">One-Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              {/* Auto-Payment */}
              <FormField
                control={form.control}
                name="autoPayment"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex items-center justify-between space-y-0 rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Auto-Payment</FormLabel>
                      <FormDescription>
                        Automatically pay this bill when it's due
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Saving Payee...
              </>
            ) : (
              <>Save Biller Payee</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BillerPayeeForm;
