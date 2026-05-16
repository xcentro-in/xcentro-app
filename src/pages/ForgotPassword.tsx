
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "@/services/api";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Mail, Lock, KeyRound, Smartphone, Loader2, RefreshCw } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string(),
  otp: z.string().length(6, { message: "OTP must be exactly 6 digits" }).regex(/^\d+$/, { message: "OTP must be numeric" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  const query = new URLSearchParams(location.search);
  const uid = query.get("uid") || "";
  const token = query.get("token") || "";
  const sig = query.get("sig") || "";

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "", otp: "" },
  });

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Resend cooldown timer (60s between resends)
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleForgotPassword = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await authAPI.forgotPassword(values.email);
      toast.success(response.message);
    } catch (err: any) {
      toast.error(err.message || "Failed to send password reset email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateOtp = async () => {
    if (!uid || !token || !sig) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authAPI.sendInviteOtp(uid, token, sig);
      toast.success(response.message || "OTP sent to your registered mobile number");
      setOtpSent(true);
      setOtpTimer(600); // 10 minutes = 600 seconds
      setResendCooldown(60); // 60s cooldown before resend
    } catch (err: any) {
      if (err.status === 403) {
        toast.error("Invalid invitation link. Please contact your administrator.");
      } else if (err.status === 429) {
        // RateLimitPopup handles the UI; just set cooldown
        const retryAfter = err.retryAfter || 60;
        setResendCooldown(retryAfter);
      } else {
        toast.error(err.message || "Failed to send OTP. Please ensure you have a mobile number registered.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Use dedicated resend endpoint
      const response = await authAPI.resendInviteOtp(uid, token, sig);
      toast.success(response.message || "OTP resent successfully");
      setOtpTimer(600);
      setResendCooldown(60);
      resetPasswordForm.setValue('otp', ''); // Clear previous OTP
    } catch (err: any) {
      if (err.status === 403) {
        toast.error("Invalid invitation link. Please contact your administrator.");
      } else if (err.status === 429) {
        // RateLimitPopup handles the UI; just set cooldown
        const retryAfter = err.retryAfter || 60;
        setResendCooldown(retryAfter);
      } else {
        toast.error(err.message || "Failed to resend OTP");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [uid, token, sig, resendCooldown, isSubmitting]);

  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    if (!uid || !token || !sig) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authAPI.resetPasswordWithOtp(uid, token, sig, values.otp, values.password);
      toast.success(response.message || "Password reset successfully. All sessions have been invalidated.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AuroraBackground>
      <Card className="w-full max-w-md shadow-lg transition-all duration-500 px-4 sm:px-6 bg-white/80 backdrop-blur-sm border-white/20">
        {uid && token && sig ? (
          <>
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <KeyRound className="h-16 w-16 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-sm text-muted-foreground">
                {otpSent ? "Enter OTP and your new password" : "Click below to receive an OTP"}
              </p>
            </CardHeader>
            <CardContent>
              {!otpSent ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Mobile verification required</p>
                        <p>We'll send an OTP to your registered mobile number for security verification.</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleGenerateOtp}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <Smartphone className="mr-2 h-4 w-4" />
                        Generate OTP
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Form {...resetPasswordForm}>
                  <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
                    <FormField
                      control={resetPasswordForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OTP</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="123456"
                              className="text-center text-2xl tracking-widest"
                              maxLength={6}
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            />
                          </FormControl>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">
                              {otpTimer > 0 ? `OTP expires in ${formatTime(otpTimer)}` : 'OTP expired'}
                            </span>
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              onClick={handleResendOtp}
                              disabled={resendCooldown > 0 || isSubmitting}
                              className="h-auto p-0 text-xs"
                            >
                              <RefreshCw className={`h-3 w-3 mr-1 ${isSubmitting ? 'animate-spin' : ''}`} />
                              {isSubmitting
                                ? "Sending..."
                                : resendCooldown > 0
                                  ? `Resend in ${resendCooldown}s`
                                  : "Resend OTP"
                              }
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={resetPasswordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            At least 8 characters with uppercase, lowercase, number, and special character
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={resetPasswordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : resendCooldown > 0 ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Resend OTP in {resendCooldown}s
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Resend OTP
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-16 w-16 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Forgot Password</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email to receive a reset link.
              </p>
            </CardHeader>
            <CardContent>
              <Form {...forgotPasswordForm}>
                <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                  <FormField
                    control={forgotPasswordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="name@company.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        )}
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Remember your password?{" "}
            <a href="/login" className="underline text-primary">
              Back to Login
            </a>
          </div>
        </CardFooter>
      </Card>
    </AuroraBackground>
  );
};

export default ForgotPassword;
