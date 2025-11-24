
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
import { determineUserRoute } from "@/services/onboardingRouter";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, initializeUser, user, userRoles, onboardingStatus } = useAuth();
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
      // Step 1: Login (authenticate)
      console.log('[Login] Authenticating user...');
      await login(values.email, values.password);
      toast.success("Login successful! Welcome to Xcentro.");

      // Step 2: Initialize user data (fetch profile, roles, onboarding status)
      console.log('[Login] Initializing user data...');
      await initializeUser();

      // Step 3: Determine where to route the user using centralized router
      console.log('[Login] Determining user route...');
      const routingDecision = determineUserRoute('/login', user, userRoles, onboardingStatus);

      console.log('[Login] Routing decision:', routingDecision);

      if (routingDecision.shouldNavigate) {
        navigate(routingDecision.targetRoute, { replace: true });
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SSO Login handler - commented out for now
  // const handleSSOLogin = () => {
  //   toast.info("SSO login coming soon");
  // };

  return (
    <AuroraBackground>
      <Card className="w-full max-w-md shadow-lg transition-all duration-500 px-4 sm:px-6 bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="https://ik.imagekit.io/mddzdzy9m/Xcentro/logo_dark_transparent.png?updatedAt=1763483534131&tr=w-200,h-200,c-at_max" 
              alt="Xcentro Logo" 
              className="h-24 w-auto object-contain" 
            />
          </div>
          <h1 className="text-2xl font-bold">Welcome to Xcentro</h1>
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
          {/* SSO Login - Coming Soon */}
          {/* <div className="relative my-6">
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
          </Button> */}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {/* <div className="text-sm text-center text-muted-foreground">
            Need help? <Link to="#" className="underline text-primary">Contact support</Link>
          </div> */}
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
