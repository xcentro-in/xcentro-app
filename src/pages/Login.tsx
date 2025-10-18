
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useAuth } from "@/contexts/AuthContext";
import { userAPI, businessAPI } from "@/services/api";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, isAuthenticated, isLoading, fetchUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated - ProtectedRoute will handle onboarding checks
  useEffect(() => {
    if (isAuthenticated) {
      // Let ProtectedRoute handle the routing based on onboarding status
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      // Step 1: Login
      await login(values.email, values.password);
      toast.success("Login successful! Welcome to PaySphere.");

      // Step 2: Fetch user roles
      const rolesResponse = await userAPI.getRoles();
      const roles = rolesResponse.data;

      console.log("User roles after login:", roles);

      // Step 3: Determine routing based on roles
      if (roles.length === 0) {
        // NO ROLES: Check both business and user onboarding status
        console.log("No roles found - checking onboarding status");

        // Check business onboarding status
        try {
          const businessStatus = await businessAPI.getOnboardingStatus();
          const kybStatus = businessStatus.data.kybStatus;

          if (kybStatus === "kyc_completed" || kybStatus === "kyc_verified") {
            // KYB completed, now check user onboarding status
            console.log("KYB completed, checking user onboarding status");

            try {
              const userStatus = await userAPI.getOnboardingStatus();
              const kycStatus = userStatus.data.kycStatus;

              if (kycStatus === "kyc_not_started" || kycStatus === "kyc_in_progress") {
                // User KYC not complete, navigate to user onboarding
                console.log("User KYC not complete, navigating to user onboarding");
                navigate("/onboarding", { replace: true });
              } else {
                // Both KYB and KYC complete but no roles - try refreshing roles
                console.log("Both KYB and KYC complete but no roles, refreshing roles");
                const refreshedRoles = await userAPI.getRoles();

                if (refreshedRoles.data.length === 0) {
                  // Still no roles - show error and logout
                  toast.error("Onboarding complete but no roles assigned. Please try again later or contact support.");
                  console.error("No roles assigned after complete onboarding");
                  await logout();
                  navigate("/login", { replace: true });
                } else {
                  // Roles now exist, route based on role
                  const primaryRole = refreshedRoles.data[0];
                  if (primaryRole.role === "none" && !primaryRole.kycNeeded) {
                    navigate("/pending-approval", { replace: true });
                  } else if (primaryRole.kycNeeded) {
                    navigate("/onboarding", { replace: true });
                  } else {
                    await fetchUserProfile();
                    navigate("/", { replace: true });
                  }
                }
              }
            } catch (userStatusError) {
              // Failed to fetch user status - show error and logout
              console.error("Failed to fetch user onboarding status:", userStatusError);
              toast.error("Unable to check your onboarding status. Please try again later.");
              await logout();
              navigate("/login", { replace: true });
            }
          } else {
            // KYB not completed, continue business onboarding
            console.log("KYB not complete, navigating to business onboarding");
            navigate("/business-onboarding", { replace: true });
          }
        } catch (businessStatusError) {
          // No business onboarding started, start fresh
          console.log("No business onboarding found, starting fresh");
          navigate("/business-onboarding", { replace: true });
        }
      } else {
        // HAS ROLES: Check primary role
        const primaryRole = roles[0];
        console.log("Primary role:", primaryRole);

        if (primaryRole.role === "none" && !primaryRole.kycNeeded) {
          // NONE role + KYC not needed = Pending approval
          console.log("Role is 'none', navigating to pending approval");
          navigate("/pending-approval", { replace: true });
        } else if (primaryRole.kycNeeded) {
          // KYC NEEDED: Go to user onboarding
          console.log("KYC needed, navigating to user onboarding");
          navigate("/onboarding", { replace: true });
        } else {
          // KYC NOT NEEDED: Load profile and go to dashboard
          console.log("KYC complete, loading profile and navigating to dashboard");
          await fetchUserProfile();
          navigate("/", { replace: true });
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSSOLogin = () => {
    toast.info("SSO login coming soon");
  };

  return (
    <AuroraBackground>
      <Card className="w-full max-w-md shadow-lg transition-all duration-500 px-4 sm:px-6 bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="https://ik.imagekit.io/mddzdzy9m/PaySphere/logo_dark_transparent.png?updatedAt=1745093381726&tr=w-200,h-200,c-at_max" 
              alt="PaySphere Logo" 
              className="h-24 w-auto object-contain" 
            />
          </div>
          <h1 className="text-2xl font-bold">Welcome to PaySphere</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="name@company.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <div className="flex items-center justify-end">
                      <Link to="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Log In
                  </>
                )}
              </Button>
            </form>
          </Form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSSOLogin}
          >
            Single Sign-On (SSO)
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Need help? <Link to="#" className="underline text-primary">Contact support</Link>
          </div>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuroraBackground>
  );
};

export default Login;
