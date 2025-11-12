import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Files, FileSpreadsheet, Receipt, Users, File, Clock, Lock } from "lucide-react";
import { FeatureFlagName } from "@/lib/featureFlags"
import { FeatureEnabled } from "@/components/FeatureEnabled";
import { useAuth } from "@/contexts/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type PaymentCategory = "selection" | "single" | "batch" | "gst" | "creditcard" | "payroll" | "invoice";

interface PaymentCategorySelectionProps {
  onSelect: (category: PaymentCategory) => void;
}

const PaymentCategorySelection: React.FC<PaymentCategorySelectionProps> = ({ onSelect }) => {
  const { user } = useAuth();
  const hasCreatedFirstPayment = user?.hasCreatedFirstPayment ?? false;

  // Define feature flag mapping
  const categoryFeatureFlags: Record<string, FeatureFlagName> = {
    gst: 'GST_PAYMENTS',
    creditcard: 'CREDIT_CARD_MANAGEMENT',
  } as const;

  const categories = [
    {
      id: "single",
      title: "Quick Payment",
      description: "Make quick payments to your vendor",
      icon: <Clock className="h-10 w-10 text-primary" />,
    },
    {
      id: "batch",
      title: "Batch Payment",
      description: "Make multiple quick payments at once by uploading a file.",
      icon: <Files className="h-10 w-10 text-primary" />,
    },
    {
      id: "gst",
      title: "GST Payment",
      description: "Upload GST challan or pay GST taxes directly",
      icon: <FileSpreadsheet className="h-10 w-10 text-primary" />,
    },
    {
      id: "creditcard",
      title: "Credit Card Bill",
      description: "Pay your credit card bills quickly",
      icon: <Receipt className="h-10 w-10 text-primary" />,
    },
    {
      id: "payroll",
      title: "Payroll",
      description: "Process employee salary payments",
      icon: <Users className="h-10 w-10 text-primary" />,
    },
    {
      id: "invoice",
      title: "Invoice Payment",
      description: "Pay all your invoices in one go",
      icon: <File className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center mb-6">Select Payment Type</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => {
          const featureFlag = categoryFeatureFlags[category.id] || 'ALLOWED_FIELDS';

          // Check if category should be disabled (all except "single" when no first payment)
          const isDisabledByOnboarding = !hasCreatedFirstPayment && category.id !== "single";

          // Render disabled state with tooltip for onboarding-locked categories
          if (isDisabledByOnboarding) {
            return (
              <TooltipProvider key={category.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      className="opacity-50 cursor-not-allowed relative"
                    >
                      <CardContent className="flex flex-col items-center text-center p-6 h-full">
                        <div className="absolute top-4 right-4 text-muted-foreground">
                          <Lock className="h-5 w-5" />
                        </div>
                        <div className="p-4 rounded-full mb-4 bg-muted">
                          {category.icon}
                        </div>
                        <h3 className="font-medium text-lg mb-2 text-muted-foreground">{category.title}</h3>
                        <p className="text-muted-foreground text-sm">{category.description}</p>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>Complete your first payment to unlock advanced payment options</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          // Render normal clickable category
          return (
            <FeatureEnabled key={category.id} featureFlag={featureFlag}>
              <Card
                className="hover:border-primary hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelect(category.id as PaymentCategory)}
              >
                <CardContent className="flex flex-col items-center text-center p-6 h-full">
                  <div className="p-4 rounded-full mb-4 bg-primary/10">
                    {category.icon}
                  </div>
                  <h3 className="font-medium text-lg mb-2">{category.title}</h3>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </CardContent>
              </Card>
            </FeatureEnabled>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentCategorySelection;
