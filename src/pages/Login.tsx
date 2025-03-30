
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import AnimatedBackground from "@/components/ui/animated-background";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    console.log(values);
    toast.success("Login successful!");
    navigate("/");
  };

  const handleSSOLogin = () => {
    toast.info("SSO login coming soon");
  };

  return (
    <AnimatedBackground>
      <Card className="w-full max-w-md shadow-lg transition-all duration-500">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/placeholder.svg" 
              alt="PaySphere Logo" 
              className="h-12 w-auto" 
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" /> Log In
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
    </AnimatedBackground>
  );
};

export default Login;
