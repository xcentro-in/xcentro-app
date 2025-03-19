
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, CreditCard, Info, Lock, ArrowUp, List, Badge as BadgeIcon, DollarSign } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

// Types for subscription plans
type PlanTier = "basic" | "silver" | "gold" | "platinum";

interface PlanFeature {
  name: string;
  basic: boolean | string;
  silver: boolean | string;
  gold: boolean | string;
  platinum: boolean | string;
}

const SubscriptionSettings = () => {
  const [currentPlan, setCurrentPlan] = useState<PlanTier>("basic");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<PlanTier | null>(null);

  const planPricing = {
    basic: { monthly: 0, annual: 0 },
    silver: { monthly: 19.99, annual: 199.99 },
    gold: { monthly: 49.99, annual: 499.99 },
    platinum: { monthly: 99.99, annual: 999.99 }
  };

  const featureCategories = [
    {
      category: "Payments & Transactions",
      features: [
        {
          name: "Standard Payments",
          basic: "✅ Standard bank & credit card payments",
          silver: "✅ Lower platform fee",
          gold: "✅ Preferred rates on credit card payments",
          platinum: "✅ Zero platform fee on select transactions"
        }
      ]
    },
    {
      category: "Bulk & Recurring Payments",
      features: [
        {
          name: "Bulk Payment Processing",
          basic: false,
          silver: "✅ Limited transactions",
          gold: "✅ Unlimited bulk payments",
          platinum: "✅ Priority processing & approval automation"
        }
      ]
    },
    {
      category: "GST Payments",
      features: [
        {
          name: "GST Processing",
          basic: "❌ Manual entry required",
          silver: "✅ Limited OCR extractions",
          gold: "✅ Full automated OCR",
          platinum: "✅ Instant GST tax reconciliation"
        }
      ]
    },
    {
      category: "Credit Card Bills",
      features: [
        {
          name: "Bill Management",
          basic: "✅ Manual entry only",
          silver: "✅ Upload bills & track due dates",
          gold: "✅ Insights & analytics included",
          platinum: "✅ Auto-suggestions for best payment methods"
        }
      ]
    },
    {
      category: "Rewards",
      features: [
        {
          name: "Earning & Redemption",
          basic: "🟡 Basic reward rates",
          silver: "🟡 Better reward multipliers",
          gold: "🔥 Gold-tier bonuses on transactions",
          platinum: "🚀 Exclusive VIP redemption options"
        }
      ]
    },
    {
      category: "Business Insights",
      features: [
        {
          name: "Expense Analytics",
          basic: false,
          silver: "✅ Standard analytics",
          gold: "✅ AI-powered category analysis",
          platinum: "✅ Custom reports & strategic recommendations"
        }
      ]
    },
    {
      category: "Multi-Business",
      features: [
        {
          name: "Business Profiles",
          basic: "❌ One business only",
          silver: "✅ Up to 2 businesses",
          gold: "✅ Up to 5 businesses",
          platinum: "✅ Unlimited business profiles"
        }
      ]
    },
    {
      category: "Payment Calendar",
      features: [
        {
          name: "Smart Calendar",
          basic: "✅ View payments",
          silver: "✅ View & filter payments",
          gold: "✅ Approval workflows",
          platinum: "✅ Automated alerts & priority scheduling"
        }
      ]
    },
    {
      category: "Access & Security",
      features: [
        {
          name: "Role-Based Access",
          basic: "✅ Basic roles",
          silver: "✅ Custom permissions",
          gold: "✅ Multi-tier approval workflows",
          platinum: "✅ Dedicated account manager"
        }
      ]
    },
    {
      category: "Credit Card Insights",
      features: [
        {
          name: "Card Analytics",
          basic: false,
          silver: "✅ Basic expense tracking",
          gold: "✅ Hidden fee analysis",
          platinum: "✅ Personalized card usage recommendations"
        }
      ]
    },
    {
      category: "Customer Support",
      features: [
        {
          name: "Support Access",
          basic: "✅ Email support",
          silver: "✅ Priority chat support",
          gold: "✅ Dedicated account specialist",
          platinum: "✅ 24/7 VIP business concierge"
        }
      ]
    }
  ];

  const handleUpgrade = (plan: PlanTier) => {
    setSelectedUpgradePlan(plan);
    setShowUpgradeDialog(true);
  };

  const confirmUpgrade = () => {
    if (selectedUpgradePlan) {
      toast.success(`Successfully upgraded to ${selectedUpgradePlan.charAt(0).toUpperCase() + selectedUpgradePlan.slice(1)} plan!`);
      setCurrentPlan(selectedUpgradePlan);
      setShowUpgradeDialog(false);
    }
  };

  const toggleBillingCycle = () => {
    setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly");
    toast.info(`Switched to ${billingCycle === "monthly" ? "annual" : "monthly"} billing cycle`);
  };

  const calculateSavings = (plan: PlanTier) => {
    const monthly = planPricing[plan].monthly * 12;
    const annual = planPricing[plan].annual;
    return Math.round((1 - annual / monthly) * 100);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Billing & Subscription</h2>
        <p className="text-muted-foreground mt-1">Manage your PaySphere subscription and billing details</p>
      </div>

      {/* Current Plan Summary */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Monthly</span>
              <Switch checked={billingCycle === "annual"} onCheckedChange={toggleBillingCycle} />
              <span className="text-sm text-muted-foreground">Annual</span>
              {billingCycle === "annual" && (
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                  Save up to 20%
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between pb-6 border-b">
            <div>
              <Badge className={`${
                currentPlan === "basic" ? "bg-gray-500" :
                currentPlan === "silver" ? "bg-gray-400" :
                currentPlan === "gold" ? "bg-amber-500" :
                "bg-purple-700"
              } mb-2`}>
                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
              </Badge>
              <h3 className="text-2xl font-bold">
                ${planPricing[currentPlan][billingCycle]}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  /{billingCycle === "monthly" ? "mo" : "year"}
                </span>
              </h3>
              {billingCycle === "annual" && currentPlan !== "basic" && (
                <p className="text-sm text-green-600 mt-1">
                  You save {calculateSavings(currentPlan)}% with annual billing
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Next billing date: Nov 15, 2023</span>
              </div>
              {currentPlan !== "basic" && (
                <Button variant="outline" size="sm">
                  Update payment method
                </Button>
              )}
            </div>
          </div>

          {/* Quick Plan Benefits */}
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Key Benefits</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {featureCategories.slice(0, 6).map((category) => (
                <div key={category.category} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">{category.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {typeof category.features[0][currentPlan] === "string" 
                        ? category.features[0][currentPlan].toString().replace(/^✅ |^❌ |^🟡 |^🔥 |^🚀 /, '')
                        : category.features[0][currentPlan] 
                          ? "Available" 
                          : "Not available"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Compare Plans</h3>
        <div className="overflow-x-auto pb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left pb-4 w-1/5">Features</th>
                <th className="px-4 pb-4 text-center">
                  <div className="flex flex-col items-center">
                    <Badge className="bg-gray-500 mb-1">Basic</Badge>
                    <span className="font-bold">$0</span>
                    <span className="text-xs text-muted-foreground">Free</span>
                    {currentPlan === "basic" ? (
                      <Badge variant="outline" className="mt-2">Current Plan</Badge>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleUpgrade("basic")}
                      >
                        Downgrade
                      </Button>
                    )}
                  </div>
                </th>
                <th className="px-4 pb-4 text-center">
                  <div className="flex flex-col items-center">
                    <Badge className="bg-gray-400 mb-1">Silver</Badge>
                    <span className="font-bold">${planPricing.silver[billingCycle]}</span>
                    <span className="text-xs text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "year"}</span>
                    {currentPlan === "silver" ? (
                      <Badge variant="outline" className="mt-2">Current Plan</Badge>
                    ) : currentPlan === "basic" ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleUpgrade("silver")}
                      >
                        Upgrade
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleUpgrade("silver")}
                      >
                        Downgrade
                      </Button>
                    )}
                  </div>
                </th>
                <th className="px-4 pb-4 text-center">
                  <div className="flex flex-col items-center">
                    <Badge className="bg-amber-500 mb-1">Gold</Badge>
                    <span className="font-bold">${planPricing.gold[billingCycle]}</span>
                    <span className="text-xs text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "year"}</span>
                    {currentPlan === "gold" ? (
                      <Badge variant="outline" className="mt-2">Current Plan</Badge>
                    ) : currentPlan === "platinum" ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleUpgrade("gold")}
                      >
                        Downgrade
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleUpgrade("gold")}
                      >
                        Upgrade
                      </Button>
                    )}
                  </div>
                </th>
                <th className="px-4 pb-4 text-center">
                  <div className="flex flex-col items-center">
                    <Badge className="bg-purple-700 mb-1">Platinum</Badge>
                    <span className="font-bold">${planPricing.platinum[billingCycle]}</span>
                    <span className="text-xs text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "year"}</span>
                    {currentPlan === "platinum" ? (
                      <Badge variant="outline" className="mt-2">Current Plan</Badge>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleUpgrade("platinum")}
                      >
                        Upgrade
                      </Button>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {featureCategories.map((category) => (
                <React.Fragment key={category.category}>
                  <tr>
                    <td colSpan={5} className="pt-4 pb-2 font-medium">{category.category}</td>
                  </tr>
                  {category.features.map((feature, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="py-3 text-sm">{feature.name}</td>
                      <td className="px-4 py-3 text-center text-sm">
                        {typeof feature.basic === "string" ? (
                          <div dangerouslySetInnerHTML={{ __html: feature.basic }} />
                        ) : feature.basic ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {typeof feature.silver === "string" ? (
                          <div dangerouslySetInnerHTML={{ __html: feature.silver }} />
                        ) : feature.silver ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {typeof feature.gold === "string" ? (
                          <div dangerouslySetInnerHTML={{ __html: feature.gold }} />
                        ) : feature.gold ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {typeof feature.platinum === "string" ? (
                          <div dangerouslySetInnerHTML={{ __html: feature.platinum }} />
                        ) : feature.platinum ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your recent invoices and payment history</CardDescription>
        </CardHeader>
        <CardContent>
          {currentPlan === "basic" ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No billing history available on the Basic plan</p>
              <Button variant="outline" className="mt-4" onClick={() => handleUpgrade("silver")}>
                Upgrade to Silver
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium">Invoice #2023-10-15</p>
                  <p className="text-sm text-muted-foreground">Oct 15, 2023</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">${planPricing[currentPlan][billingCycle]}</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Paid
                  </Badge>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium">Invoice #2023-09-15</p>
                  <p className="text-sm text-muted-foreground">Sept 15, 2023</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">${planPricing[currentPlan][billingCycle]}</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Paid
                  </Badge>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentPlan === "basic" || 
               (currentPlan === "silver" && selectedUpgradePlan === "gold") || 
               (currentPlan === "gold" && selectedUpgradePlan === "platinum")
                ? "Upgrade to " 
                : "Downgrade to "}
              {selectedUpgradePlan?.charAt(0).toUpperCase()}{selectedUpgradePlan?.slice(1)} Plan
            </DialogTitle>
            <DialogDescription>
              {currentPlan === "basic" || 
               (currentPlan === "silver" && selectedUpgradePlan === "gold") || 
               (currentPlan === "gold" && selectedUpgradePlan === "platinum")
               ? "You're about to upgrade your subscription. You'll be charged immediately for the difference." 
               : "You're about to downgrade your subscription. The change will take effect at the end of your current billing cycle."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <span>New plan cost</span>
              <span className="font-semibold">
                ${planPricing[selectedUpgradePlan as PlanTier][billingCycle]}/{billingCycle === "monthly" ? "mo" : "year"}
              </span>
            </div>
            
            {(currentPlan === "basic" || 
             (currentPlan === "silver" && selectedUpgradePlan === "gold") || 
             (currentPlan === "gold" && selectedUpgradePlan === "platinum")) && (
              <div className="flex justify-between items-center">
                <span>Immediate charge</span>
                <span className="font-semibold">
                  ${planPricing[selectedUpgradePlan as PlanTier][billingCycle]}
                </span>
              </div>
            )}

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">What's included:</h4>
              <ul className="space-y-2">
                {featureCategories.slice(0, 4).map((category) => (
                  <li key={category.category} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                    <span className="text-sm">{
                      typeof category.features[0][selectedUpgradePlan as PlanTier] === "string"
                        ? category.features[0][selectedUpgradePlan as PlanTier].toString().replace(/^✅ |^❌ |^🟡 |^🔥 |^🚀 /, '')
                        : "Available"
                    }</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpgrade}>
              Confirm {currentPlan === "basic" || 
                      (currentPlan === "silver" && selectedUpgradePlan === "gold") || 
                      (currentPlan === "gold" && selectedUpgradePlan === "platinum")
                       ? "Upgrade" 
                       : "Downgrade"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionSettings;
