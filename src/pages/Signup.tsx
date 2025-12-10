import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { authAPI } from "@/services/api";

const step1Schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type Step1FormValues = z.infer<typeof step1Schema>;

const Signup = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const form = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: Step1FormValues) => {
    setIsSubmitting(true);

    try {
      const response = await authAPI.signup(values.email, values.password);
      setVerificationMessage(response.message);
      setShowSuccess(true);
      toast.success("Account created successfully!");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to create account. Please try again.";
      toast.error(errorMessage);
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold">
            {showSuccess ? "Check Your Email" : "Create an Account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {showSuccess
              ? "We've sent you a verification link"
              : "Enter your details to create your Xcentro account"
            }
          </p>
        </CardHeader>
        <CardContent>
          {!showSuccess ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-xs text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <a
                    href="https://www.xcentro.in/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Terms and Conditions
                  </a>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            // Email Verification Success
            <div className="space-y-6 text-center py-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Account Created Successfully!
                </h3>
                <p className="text-sm text-muted-foreground px-4">
                  {verificationMessage}
                </p>
                <p className="text-sm text-muted-foreground px-4">
                  Please check your email inbox and click the verification link to activate your account.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  What's next?
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Check your email inbox (and spam folder)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>Click the verification link in the email</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>Return to login page to access your account</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Go to Login Page
              </Button>

              <div className="text-xs text-muted-foreground">
                Didn't receive the email?{" "}
                <button
                  onClick={() => toast.info("Please check your spam folder or contact support")}
                  className="text-primary underline"
                >
                  Get help
                </button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {/* <div className="text-sm text-center text-muted-foreground">
            Need help? <Link to="#" className="underline text-primary">Contact support</Link>
          </div> */}
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">
              Log In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuroraBackground>
  );
};

export default Signup;
