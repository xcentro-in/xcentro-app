import { useNavigate } from "react-router-dom";
import { CreditCard, Users, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: 'payment-method' | 'vendor' | 'first-payment';
  stepNumber: number;
  title: string;
  description: string;
  icon: typeof CreditCard;
  ctaText: string;
  ctaLink: string;
  checkFlag:  'hasAddedVendor' | 'hasAddedPaymentMethod' | 'hasCreatedFirstPayment';
}

const EmptyStateDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const steps: OnboardingStep[] = [
    {
      id: 'vendor',
      stepNumber: 1,
      title: 'Set up your vendors',
      description: 'Add vendors and service providers you work with.',
      icon: Users,
      ctaText: 'Add Vendors',
      ctaLink: '/payees',
      checkFlag: 'hasAddedVendor',
    },
    {
      id: 'payment-method',
      stepNumber: 2,
      title: 'Add your payment sources',
      description: 'Connect your business credit cards or bank accounts to start making payments seamlessly.',
      icon: CreditCard,
      ctaText: 'Add Payment Source',
      ctaLink: '/wallet',
      checkFlag: 'hasAddedPaymentMethod',
    },
    {
      id: 'first-payment',
      stepNumber: 3,
      title: 'Process your first payment',
      description: 'Payout your first expense. Track everything in real-time and manage your business finances effortlessly.',
      icon: Send,
      ctaText: 'Make Payment',
      ctaLink: '/new-payment',
      checkFlag: 'hasCreatedFirstPayment',
    },
  ];

  // Calculate progress
  const completedSteps = steps.filter(step => user?.[step.checkFlag] === true).length;
  const progressPercentage = (completedSteps / steps.length) * 100;
  
  // Find next incomplete step
  const nextStepIndex = steps.findIndex(step => !user?.[step.checkFlag]);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Xcentro, {firstName}! 🚀
        </h1>
        <p className="text-lg text-muted-foreground">
          Let's get your account set up in 3 simple steps
        </p>
        
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mx-auto space-y-2 pt-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Your Progress</span>
            <span className="text-muted-foreground">
              {completedSteps} of {steps.length} steps completed
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Cards */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = user?.[step.checkFlag] === true;
          const isActive = index === nextStepIndex;
          const isLocked = index > nextStepIndex;
          const Icon = step.icon;

          return (
            <Card
              key={step.id}
              className={cn(
                "p-6 transition-all duration-300 animate-scale-in",
                isCompleted && "bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50",
                isActive && "bg-primary/5 border-primary border-2 pulse-border shadow-lg shadow-primary/10",
                isLocked && "bg-muted/20 border-muted/40 opacity-60"
              )}
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              <div className="flex items-start gap-6">
                {/* Icon Container */}
                <div className="relative flex-shrink-0">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                      isCompleted && "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                      isActive && "bg-primary/10 text-primary",
                      isLocked && "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  {/* Checkmark Badge */}
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-background shadow-sm animate-in zoom-in-0 duration-300">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                          isCompleted && "bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-300",
                          isActive && "bg-primary text-primary-foreground",
                          isLocked && "bg-muted text-muted-foreground"
                        )}
                      >
                        {step.stepNumber}
                      </span>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-9">
                      {step.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="pl-9">
                    {isCompleted ? (
                      <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                        <Check className="w-4 h-4" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => navigate(step.ctaLink)}
                        variant={isActive ? "default" : "outline"}
                        disabled={isLocked}
                        className={cn(
                          "transition-all duration-200",
                          isActive && "hover:shadow-lg hover:scale-105"
                        )}
                      >
                        {step.ctaText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedSteps === steps.length && (
        <Card className="p-6 bg-primary/5 border-primary animate-fade-in text-center">
          <p className="text-lg font-medium">
            🎉 Congratulations! You've completed all the setup steps. Your dashboard is now active!
          </p>
        </Card>
      )}
    </div>
  );
};

export default EmptyStateDashboard;
