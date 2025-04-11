
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, CreditCard, Calendar, Bell, Download, BadgeCheck, Award, Gem, Shield, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Define plan types and pricing
interface PlanFeature {
  name: string;
  basic: string | boolean;
  silver: string | boolean;
  gold: string | boolean;
  platinum: string | boolean;
  icon?: React.ReactNode;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  color: string;
  recommendedFor: string;
  icon: React.ReactNode;
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Essential features for individual users",
    monthlyPrice: 0,
    annualPrice: 0,
    color: "bg-gray-100 border-gray-200",
    recommendedFor: "Small businesses or individuals",
    icon: <Shield className="h-6 w-6 text-gray-500" />,
  },
  {
    id: "silver",
    name: "Silver",
    description: "Enhanced features and support",
    monthlyPrice: 9.99,
    annualPrice: 99.99,
    color: "bg-gray-100 border-gray-300",
    recommendedFor: "Growing businesses",
    icon: <BadgeCheck className="h-6 w-6 text-gray-500" />,
  },
  {
    id: "gold",
    name: "Gold Premium",
    description: "Advanced features and analytics",
    monthlyPrice: 19.99,
    annualPrice: 199.99,
    color: "bg-amber-50 border-amber-200",
    recommendedFor: "Established businesses",
    icon: <Star className="h-6 w-6 text-amber-500" />,
  },
  {
    id: "platinum",
    name: "Platinum Elite",
    description: "Complete solution with priority access",
    monthlyPrice: 49.99,
    annualPrice: 499.99,
    color: "bg-purple-50 border-purple-200",
    recommendedFor: "Enterprise businesses",
    icon: <Gem className="h-6 w-6 text-purple-500" />,
  },
];

const features: PlanFeature[] = [
  {
    name: "Payments & Transactions",
    basic: "Standard bank & credit card payments",
    silver: "Lower platform fee",
    gold: "Preferred rates on credit card payments",
    platinum: "Zero platform fee on select transactions",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    name: "Bulk & Recurring Payments",
    basic: false,
    silver: "Limited transactions",
    gold: "Unlimited bulk payments",
    platinum: "Priority processing & approval automation",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    name: "GST Payments (OCR & Processing)",
    basic: "Manual entry required",
    silver: "Limited OCR extractions",
    gold: "Full automated OCR",
    platinum: "Instant GST tax reconciliation",
  },
  {
    name: "Pay Credit Card Bills",
    basic: "Manual entry only",
    silver: "Upload bills & track due dates",
    gold: "Insights & analytics included",
    platinum: "Auto-suggestions for best payment methods",
  },
  {
    name: "Rewards Earning & Redemption",
    basic: "Basic reward rates",
    silver: "Better reward multipliers",
    gold: "Gold-tier bonuses on transactions",
    platinum: "Exclusive VIP redemption options",
    icon: <Award className="h-4 w-4" />,
  },
  {
    name: "Business Expense Insights",
    basic: false,
    silver: "Standard analytics",
    gold: "AI-powered category analysis",
    platinum: "Custom reports & strategic recommendations",
  },
  {
    name: "Multi-Business Management",
    basic: "One business only",
    silver: "Up to 2 businesses",
    gold: "Up to 5 businesses",
    platinum: "Unlimited business profiles",
  },
  {
    name: "Smart Payment Calendar",
    basic: "View payments",
    silver: "View & filter payments",
    gold: "Approval workflows",
    platinum: "Automated alerts & priority scheduling",
  },
  {
    name: "Role-Based Access & Security",
    basic: "Basic roles",
    silver: "Custom permissions",
    gold: "Multi-tier approval workflows",
    platinum: "Dedicated account manager",
  },
  {
    name: "Credit Card Insights & Comparisons",
    basic: false,
    silver: "Basic expense tracking",
    gold: "Hidden fee analysis",
    platinum: "Personalized card usage recommendations",
  },
  {
    name: "Customer Support & Assistance",
    basic: "Email support",
    silver: "Priority chat support",
    gold: "Dedicated account specialist",
    platinum: "24/7 VIP business concierge",
  },
];

const SubscriptionSettings = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [activeTab, setActiveTab] = useState("plans");

  const handlePlanChange = (planId: string) => {
    toast.success(`Plan changed to ${planId.charAt(0).toUpperCase() + planId.slice(1)}`);
    setSelectedPlan(planId);
  };

  const handleBillingCycleChange = () => {
    setIsAnnual(!isAnnual);
    toast.info(`Billing cycle changed to ${!isAnnual ? 'annual' : 'monthly'}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Billing & Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription plan and payment details
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Current Plan: {plans.find(p => p.id === selectedPlan)?.name}
              </CardTitle>
              <CardDescription>
                You are currently on the {plans.find(p => p.id === selectedPlan)?.name} plan with {isAnnual ? 'annual' : 'monthly'} billing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <span className="font-medium">Billing Cycle</span>
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${!isAnnual ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>Monthly</span>
                  <Switch
                    checked={isAnnual}
                    onCheckedChange={handleBillingCycleChange}
                  />
                  <span className={`text-sm ${isAnnual ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>Annual <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">Save 20%</span></span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`border-2 transition-all h-full flex flex-col ${selectedPlan === plan.id ? 'border-primary ring-1 ring-primary' : 'border-border'} ${plan.color}`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {plan.icon}
                            {plan.name}
                          </CardTitle>
                          <CardDescription className="mt-1">{plan.description}</CardDescription>
                        </div>
                        {plan.id === 'gold' && (
                          <span className="bg-amber-100 text-amber-800 text-xs font-medium py-1 px-2 rounded">Popular</span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4 flex-grow">
                      <div className="mb-4">
                        <div className="text-3xl font-bold">
                          ${isAnnual ? plan.annualPrice.toFixed(2) : plan.monthlyPrice.toFixed(2)}
                          <span className="text-sm font-normal text-muted-foreground">
                            {isAnnual ? '/year' : '/month'}
                          </span>
                        </div>
                        {isAnnual && plan.id !== 'basic' && (
                          <p className="text-sm text-muted-foreground mt-1">
                            ${plan.monthlyPrice.toFixed(2)} monthly
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Recommended for:
                      </p>
                      <p className="text-sm font-medium mb-4">
                        {plan.recommendedFor}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button 
                        className="w-full" 
                        variant={selectedPlan === plan.id ? "secondary" : "default"}
                        onClick={() => handlePlanChange(plan.id)}
                      >
                        {selectedPlan === plan.id ? "Current Plan" : "Choose Plan"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plan Comparison</CardTitle>
              <CardDescription>
                Compare features across different plans to find the right one for your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-4 px-4 text-left font-medium w-1/3">Feature</th>
                      {plans.map((plan) => (
                        <th key={plan.id} className="py-4 px-4 text-center font-medium">
                          <div className="flex flex-col items-center gap-1">
                            {plan.icon}
                            {plan.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, idx) => (
                      <tr key={idx} className={`border-b ${idx % 2 === 0 ? 'bg-muted/30' : ''}`}>
                        <td className="py-3 px-4 font-medium flex items-center gap-2">
                          {feature.icon}
                          {feature.name}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {feature.basic === false ? (
                            <X className="h-5 w-5 text-destructive mx-auto" />
                          ) : feature.basic === true ? (
                            <Check className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <div className="text-sm">{feature.basic}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {feature.silver === false ? (
                            <X className="h-5 w-5 text-destructive mx-auto" />
                          ) : feature.silver === true ? (
                            <Check className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <div className="text-sm">{feature.silver}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {feature.gold === false ? (
                            <X className="h-5 w-5 text-destructive mx-auto" />
                          ) : feature.gold === true ? (
                            <Check className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <div className="text-sm">{feature.gold}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {feature.platinum === false ? (
                            <X className="h-5 w-5 text-destructive mx-auto" />
                          ) : feature.platinum === true ? (
                            <Check className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <div className="text-sm">{feature.platinum}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Billing History
              </CardTitle>
              <CardDescription>
                View and download your previous invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Invoice #3429</p>
                      <p className="text-sm text-muted-foreground">April 1, 2023</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">$9.99</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-md border">
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Invoice #3301</p>
                      <p className="text-sm text-muted-foreground">March 1, 2023</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">$9.99</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-md border">
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Invoice #3244</p>
                      <p className="text-sm text-muted-foreground">February 1, 2023</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">$9.99</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 09/2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-start">
                <Button className="w-auto">Add New Payment Method</Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Billing Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">123 Business Ave</p>
                    <p className="text-sm text-muted-foreground">Suite 456</p>
                    <p className="text-sm text-muted-foreground">San Francisco, CA 94107</p>
                    <p className="text-sm text-muted-foreground">United States</p>
                  </div>
                  <div className="flex items-start justify-end">
                    <Button variant="outline" size="sm">Edit Address</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionSettings;
