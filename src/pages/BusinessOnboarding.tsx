
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ArrowLeft, 
  ArrowRight, 
  Building, 
  Upload, 
  CheckCircle2,
  FileText
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type BusinessType = "sole_proprietor" | "partnership" | "private_limited" | "llp" | "public_limited" | "other";
type BusinessModel = "b2b" | "b2c" | "d2c" | "marketplace" | "saas" | "other";
type TurnoverRange = "0-10L" | "10L-50L" | "50L-1Cr" | "1Cr-5Cr" | "5Cr-25Cr" | "25Cr+";

interface BusinessFormData {
  name: string;
  panNumber: string;
  businessType: BusinessType;
  businessModel: BusinessModel;
  turnover: TurnoverRange;
  businessDeed?: File;
}

const steps = [
  "Business Details",
  "Business Classification",
  "Document Upload",
  "Review & Submit"
];

const BusinessOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const form = useForm<BusinessFormData>({
    defaultValues: {
      name: "",
      panNumber: "",
      businessType: "private_limited",
      businessModel: "b2b",
      turnover: "1Cr-5Cr"
    }
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
        setUploadedFile(file);
        setUploading(false);
        toast.success("Document uploaded successfully");
      }, 1500);
    }
  };
  
  const onSubmit = (data: BusinessFormData) => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the form
      console.log("Form submitted:", data);
      toast.success("Business verification submitted successfully");
      navigate("/settings");
    }
  };
  
  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/settings");
    }
  };
  
  const getProgressValue = () => {
    return (currentStep / steps.length) * 100;
  };

  return (
    <div className="container max-w-4xl py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={goBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Business</h1>
      </div>
      
      <div className="grid grid-cols-[250px_1fr] gap-6">
        <div className="space-y-6">
          <div className="border rounded-md p-4">
            <div className="text-sm font-medium mb-2">Progress</div>
            <Progress 
              value={getProgressValue()} 
              className="mb-4"
              showMilestones
              milestones={steps}
              currentStep={currentStep}
            />
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1]}</CardTitle>
              <CardDescription>
                Complete the following information to add your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name (as per PAN)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter business name" {...field} />
                            </FormControl>
                            <FormDescription>
                              This should match exactly with the name on your PAN card
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="panNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business PAN Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="AAAAA0000A" 
                                {...field} 
                                maxLength={10} 
                                onChange={(e) => {
                                  e.target.value = e.target.value.toUpperCase();
                                  field.onChange(e);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your 10-digit Permanent Account Number
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="sole_proprietor">Sole Proprietorship</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="private_limited">Private Limited Company</SelectItem>
                                <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
                                <SelectItem value="public_limited">Public Limited Company</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The legal structure of your business
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="businessModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Model</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select business model" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="b2b">B2B (Business to Business)</SelectItem>
                                <SelectItem value="b2c">B2C (Business to Consumer)</SelectItem>
                                <SelectItem value="d2c">D2C (Direct to Consumer)</SelectItem>
                                <SelectItem value="marketplace">Marketplace</SelectItem>
                                <SelectItem value="saas">SaaS (Software as a Service)</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How your business primarily operates
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="turnover"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Annual Turnover Range</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select turnover range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0-10L">₹0 - ₹10 Lakhs</SelectItem>
                                <SelectItem value="10L-50L">₹10 Lakhs - ₹50 Lakhs</SelectItem>
                                <SelectItem value="50L-1Cr">₹50 Lakhs - ₹1 Crore</SelectItem>
                                <SelectItem value="1Cr-5Cr">₹1 Crore - ₹5 Crore</SelectItem>
                                <SelectItem value="5Cr-25Cr">₹5 Crore - ₹25 Crore</SelectItem>
                                <SelectItem value="25Cr+">Above ₹25 Crore</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Your estimated annual business turnover
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="border rounded-md p-6 text-center space-y-4">
                        {!uploadedFile ? (
                          <>
                            <div className="flex justify-center">
                              <div className="bg-primary/10 rounded-full p-4">
                                <Upload className="h-6 w-6 text-primary" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium">Upload Business Deed</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Acceptable formats: PDF, JPG, PNG (Max 5MB)
                              </p>
                            </div>
                            <div>
                              <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md inline-flex items-center gap-2">
                                  <Upload className="h-4 w-4" />
                                  <span>Select File</span>
                                </div>
                                <input
                                  id="file-upload"
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  className="hidden"
                                  onChange={handleFileChange}
                                />
                              </label>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-center">
                              <div className="bg-green-500/10 rounded-full p-4">
                                <FileText className="h-6 w-6 text-green-500" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium">Document Uploaded</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
                              </p>
                            </div>
                            <div>
                              <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="bg-muted hover:bg-muted/90 py-2 px-4 rounded-md inline-flex items-center gap-2">
                                  <Upload className="h-4 w-4" />
                                  <span>Replace File</span>
                                </div>
                                <input
                                  id="file-upload"
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  className="hidden"
                                  onChange={handleFileChange}
                                />
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <div className="border rounded-md p-6">
                        <h3 className="font-medium text-lg mb-4">Review Business Information</h3>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Business Name</div>
                              <div className="font-medium">{form.getValues("name")}</div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-muted-foreground">PAN Number</div>
                              <div className="font-medium">{form.getValues("panNumber")}</div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Business Type</div>
                              <div className="font-medium">
                                {form.getValues("businessType") === "private_limited" ? "Private Limited Company" : 
                                  form.getValues("businessType") === "sole_proprietor" ? "Sole Proprietorship" :
                                  form.getValues("businessType") === "partnership" ? "Partnership" :
                                  form.getValues("businessType") === "llp" ? "Limited Liability Partnership" :
                                  form.getValues("businessType") === "public_limited" ? "Public Limited Company" : 
                                  "Other"}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-muted-foreground">Business Model</div>
                              <div className="font-medium">
                                {form.getValues("businessModel") === "b2b" ? "B2B (Business to Business)" : 
                                  form.getValues("businessModel") === "b2c" ? "B2C (Business to Consumer)" :
                                  form.getValues("businessModel") === "d2c" ? "D2C (Direct to Consumer)" :
                                  form.getValues("businessModel") === "marketplace" ? "Marketplace" :
                                  form.getValues("businessModel") === "saas" ? "SaaS" : 
                                  "Other"}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground">Annual Turnover</div>
                            <div className="font-medium">
                              {form.getValues("turnover") === "0-10L" ? "₹0 - ₹10 Lakhs" : 
                                form.getValues("turnover") === "10L-50L" ? "₹10 Lakhs - ₹50 Lakhs" :
                                form.getValues("turnover") === "50L-1Cr" ? "₹50 Lakhs - ₹1 Crore" :
                                form.getValues("turnover") === "1Cr-5Cr" ? "₹1 Crore - ₹5 Crore" :
                                form.getValues("turnover") === "5Cr-25Cr" ? "₹5 Crore - ₹25 Crore" : 
                                "Above ₹25 Crore"}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <div className="text-sm text-muted-foreground">Document Uploaded</div>
                            <div className="font-medium flex items-center gap-2">
                              {uploadedFile ? (
                                <>
                                  <FileText className="h-4 w-4 text-green-500" />
                                  {uploadedFile.name}
                                </>
                              ) : (
                                <span className="text-amber-500">No document uploaded</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={goBack}>
                      Back
                    </Button>
                    
                    <Button 
                      type="submit" 
                      disabled={currentStep === 3 && !uploadedFile && !uploading}
                      className="gap-2"
                    >
                      {currentStep === steps.length ? (
                        <>
                          Submit for Verification
                          <CheckCircle2 className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Next Step
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessOnboarding;
