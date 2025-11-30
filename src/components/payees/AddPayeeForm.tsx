
import { useState } from "react";

import { 
  Card, 
  CardContent
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  BanknoteIcon,
  LightbulbIcon,
  UsersIcon,
  ArrowLeft,
  Lock
} from "lucide-react";
import { PayeeType } from "@/types/payee";
import BankPayeeForm from "./forms/BankPayeeForm";
import BillerPayeeForm from "./forms/BillerPayeeForm";
import PayrollPayeeForm from "./forms/PayrollPayeeForm";
import { FeatureEnabled } from "../FeatureEnabled";
import { useAuth } from "@/contexts/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AddPayeeFormProps {
  onPayeeAdded: () => void;
}

const AddPayeeForm = ({ onPayeeAdded }: AddPayeeFormProps) => {
  const [step, setStep] = useState(1);
  const [payeeType, setPayeeType] = useState<PayeeType | null>(null);
  const { user } = useAuth();
  const hasOnboardedVendor = user?.hasOnboardedVendor ?? false;

  const handleTypeSelect = (type: PayeeType) => {
    setPayeeType(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setPayeeType(null);
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Step 1: Select Payee Type</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all hover:border-primary hover:shadow-md ${payeeType === 'bank' ? 'border-primary' : ''}`}
              onClick={() => handleTypeSelect('bank')}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <BanknoteIcon className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-medium mb-1">Vendor / Supplier</h3>
                <p className="text-sm text-muted-foreground">
                  To settle off your bills
                </p>
              </CardContent>
            </Card>
            
            <FeatureEnabled featureFlag="BILLER_PAYMENTS">
              <Card 
                className={`cursor-pointer transition-all hover:border-primary hover:shadow-md ${payeeType === 'biller' ? 'border-primary' : ''}`}
                onClick={() => handleTypeSelect('biller')}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <LightbulbIcon className="h-8 w-8 text-yellow-500 mb-4" />
                  <h3 className="text-lg font-medium mb-1">Biller Payee</h3>
                  <p className="text-sm text-muted-foreground">
                    For utility, subscriptions, and service providers
                  </p>
                </CardContent>
              </Card>
            </FeatureEnabled>
            
            {/* Payroll payee - locked if vendor not onboarded */}
            {!hasOnboardedVendor ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="opacity-50 cursor-not-allowed relative">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="absolute top-4 right-4 text-muted-foreground">
                          <Lock className="h-5 w-5" />
                        </div>
                        <UsersIcon className="h-8 w-8 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium mb-1 text-muted-foreground">Payroll Payee</h3>
                        <p className="text-sm text-muted-foreground">
                          For employee salary disbursements
                        </p>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>First add vendor to understand flow</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Card
                className={`cursor-pointer transition-all hover:border-primary hover:shadow-md ${payeeType === 'payroll' ? 'border-primary' : ''}`}
                onClick={() => handleTypeSelect('payroll')}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <UsersIcon className="h-8 w-8 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-1">Payroll Payee</h3>
                  <p className="text-sm text-muted-foreground">
                    For employee salary disbursements
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {step === 2 && payeeType && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Step 2: Fill Payee Details</h3>
            <Button 
              variant="outline" 
              onClick={handleBack} 
              className="flex items-center gap-2 font-medium text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Payee Types
            </Button>
          </div>
          
          {payeeType === "bank" && <BankPayeeForm onSubmit={onPayeeAdded} />}
          {payeeType === "biller" && (
            <FeatureEnabled featureFlag="BILLER_PAYMENTS">
              <BillerPayeeForm onSubmit={onPayeeAdded} />
            </FeatureEnabled>
          )}
          {payeeType === "payroll" && <PayrollPayeeForm onSubmit={onPayeeAdded} />}
        </div>
      )}
    </div>
  );
};

export default AddPayeeForm;
