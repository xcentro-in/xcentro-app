import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, ChevronLeft, AlertCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { userRoles, UserRoleEnum } from "@/data/mockBusinesses";
import { userAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Create conditional schema based on whether GSTIN is required
const createFormSchema = (isJoinFlow: boolean) => {
  const baseSchema = {
    claimedRole: z.string().min(1, { message: "Please select your role." }),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date of birth must be in YYYY-MM-DD format.",
    }),
    pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
      message: "PAN must be in the format ABCDE1234F.",
    }),
    aadhaar: z.string().regex(/^\d{12}$/, {
      message: "Aadhaar must be exactly 12 digits.",
    }),
  };

  if (isJoinFlow) {
    return z.object({
      ...baseSchema,
      gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/, {
        message: "GSTIN must be in the format 29ABCDE1234F1Z2."
      }),
    });
  }

  return z.object(baseSchema);
};

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

const UserOnboarding = () => {
  const navigate = useNavigate();
  const { setUserRoles, fetchUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aadhaarPopup, setAadhaarPopup] = useState<Window | null>(null);
  const [showPopupAlert, setShowPopupAlert] = useState(false);
  const [aadhaarLink, setAadhaarLink] = useState("");
  const [txnId, setTxnId] = useState("");
  // Determine flow type immediately (not in useEffect)
  const businessId = sessionStorage.getItem("business-id");
  const [isJoinFlow] = useState(!businessId); // Join flow if no business-id exists
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);
  const [kycInProgress, setKycInProgress] = useState(false);

  // Fetch user onboarding status on mount
  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      try {
        const statusResponse = await userAPI.getOnboardingStatus();
        const { name, dob, taxId, mobile, kycStatus, nationalId } = statusResponse.data;

        // If KYC is not in "not_started" state, pre-fill available data
        if (kycStatus !== "kyc_not_started") {
          setKycInProgress(true);

          // Auto-fill available fields (don't fill Aadhaar for security)
          form.reset({
            claimedRole: form.getValues("claimedRole") || "",
            name: name || "",
            dob: dob || "",
            pan: taxId || "",
            aadhaar: "", // Always let user fill Aadhaar again
            ...(isJoinFlow && { gstin: form.getValues("gstin" as keyof FormValues) as string || "" }),
          });

          console.log("Pre-filled user data from status:", { name, dob, taxId, kycStatus });
        }
      } catch (error: any) {
        // If status endpoint returns 404 or error, start fresh (no pre-fill)
        console.log("No existing user onboarding found, starting fresh");
      } finally {
        setIsFetchingStatus(false);
      }
    };

    fetchOnboardingStatus();
  }, [isJoinFlow]);

  const form = useForm<FormValues>({
    resolver: zodResolver(createFormSchema(isJoinFlow)),
    defaultValues: {
      claimedRole: "",
      name: "",
      dob: "",
      pan: "",
      aadhaar: "",
      ...(isJoinFlow && { gstin: "" }),
    },
  });

  // Check if popup was blocked
  const openAadhaarPopup = (url: string) => {
    // Show alert first
    setShowPopupAlert(true);

    setTimeout(() => {
      setShowPopupAlert(false);
      const popup = window.open(url, "aadhaar-verification", "width=800,height=600");

      if (!popup || popup.closed || typeof popup.closed === "undefined") {
        toast.error("Popup was blocked. Please enable popups for this site and try again.");
        setIsSubmitting(false);
        return;
      }

      setAadhaarPopup(popup);

      // Monitor popup closure
      const checkPopupClosed = setInterval(async () => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          setAadhaarPopup(null);

          // Call complete API when popup closes
          await handleCompleteOnboarding();
        }
      }, 500);
    }, 2000);
  };

  const handleCompleteOnboarding = async () => {
    const businessId = sessionStorage.getItem("business-id");
    const gstin = form.getValues("gstin" as keyof FormValues) as string | undefined;

    try {
      const claimedRole = form.getValues("claimedRole") as UserRoleEnum;

      console.log("Completing user onboarding:", {
        claimedRole,
        businessId,
        gstin,
        isJoinFlow
      });

      // Call complete onboarding API
      // For new business flow: pass businessId
      // For join existing business flow: pass gstin
      const completeResponse = await userAPI.completeOnboarding(
        claimedRole,
        businessId || undefined,
        gstin || undefined
      );

      console.log("Complete onboarding response:", completeResponse);

      if (completeResponse.data.status === "kyc_completed") {
        toast.success("User onboarding completed successfully!");

        // Clean up onboarding-related sessionStorage items
        sessionStorage.removeItem("kyb-needed");
        sessionStorage.removeItem("kyc-needed");
        sessionStorage.removeItem("kyb-status");
        // Keep business-id for new business flow, not needed for join flow

        // Fetch user profile and roles
        console.log("Fetching user profile and roles...");
        await fetchUserProfile();
        console.log("User profile and roles fetched successfully");

        // Navigate to dashboard
        navigate("/", { replace: true });
      } else {
        toast.error("KYC verification incomplete. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to complete user onboarding.";
      toast.error(errorMessage);
      console.error("Complete onboarding error:", error);
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    const businessId = sessionStorage.getItem("business-id");

    try {
      // If KYC is already in progress, skip init and go straight to complete
      if (kycInProgress) {
        console.log("KYC already in progress, skipping init call");
        await handleCompleteOnboarding();
        return;
      }

      // Step 1: Initialize user onboarding (only if not in progress)
      // Pass businessId only if it exists (new business flow)
      const initResponse = await userAPI.initOnboarding(
        values.name,
        values.dob,
        values.pan,
        values.aadhaar,
        businessId || undefined
      );

      setAadhaarLink(initResponse.data.aadhaarLink);
      setTxnId(initResponse.data.txnId);

      // Step 2: Open Aadhaar verification popup
      openAadhaarPopup(initResponse.data.aadhaarLink);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to initialize user onboarding.";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    if (aadhaarLink) {
      openAadhaarPopup(aadhaarLink);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  // Show loading state while fetching status
  if (isFetchingStatus) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading user information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 md:px-0">
      <div className="flex items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            User Onboarding
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete your profile to access the platform
          </p>
        </div>
      </div>

      {/* Flow indicator */}
      {isJoinFlow && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Join Existing Business</h3>
                <p className="text-sm text-blue-700 mt-1">
                  You're joining an existing business. Please provide the business GSTIN and your details below.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isJoinFlow && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-green-800">New Business Onboarding</h3>
                <p className="text-sm text-green-700 mt-1">
                  You're completing user onboarding for your new business.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* GSTIN field - only show for join existing business flow */}
              {isJoinFlow && (
                <FormField
                  control={form.control}
                  name="gstin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business GSTIN</FormLabel>
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
                      <FormDescription>
                        Enter the GSTIN of the business you want to join
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="claimedRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Your Role</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role in the business" />
                        </SelectTrigger>
                        <SelectContent>
                          {userRoles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              <div>
                                <p className="font-medium">{role.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {role.description}
                                </p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the role that best describes your position
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormDescription>As per government-issued ID</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" placeholder="YYYY-MM-DD" {...field} />
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
                    <FormLabel>PAN Number</FormLabel>
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
                    <FormDescription>Permanent Account Number</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aadhaar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhaar Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456789012"
                        maxLength={12}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>12-digit Aadhaar number for verification</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-lg border p-4 bg-amber-50 border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-amber-800">
                      Aadhaar Verification Required
                    </h3>
                    <p className="text-sm text-amber-700 mt-1">
                      After submitting this form, you'll be redirected to verify your Aadhaar.
                      This is a secure process and typically takes 2-3 minutes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Continue to Aadhaar Verification"
                  )}
                </Button>
              </div>

              {isSubmitting && aadhaarPopup && (
                <div className="rounded-lg border p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-blue-800">
                        Verification in Progress
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Complete the Aadhaar verification in the popup window. This page will
                        automatically continue once you're done.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRetry}
                        className="mt-3"
                      >
                        Retry Verification
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Popup Alert Dialog */}
      <AlertDialog open={showPopupAlert} onOpenChange={setShowPopupAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enable Popups</AlertDialogTitle>
            <AlertDialogDescription>
              A popup window will open for Aadhaar verification. Please ensure popups are enabled
              for this site. The verification window will open in 2 seconds...
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserOnboarding;
