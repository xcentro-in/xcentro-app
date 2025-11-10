import { Wallet, Shield, CreditCard, Building2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const EmptyWallet = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 animate-fade-in">
      
      {/* Section 1: Header */}
      <div className="space-y-3 text-center">
        <div className="mx-auto w-16 h-16 rounded-lg border-2 border-slate-300 bg-white flex items-center justify-center">
          <Wallet className="h-8 w-8 text-slate-600" strokeWidth={1.5} />
        </div>
        
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Add Payment Sources
        </h2>
        
        <p className="text-base text-slate-600 max-w-xl mx-auto">
          Set up your payment methods to handle vendor payments, payroll, and bills.
        </p>
      </div>

      {/* Section 2: Security & Compliance Card */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="pt-6">
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-slate-700" strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-1 uppercase tracking-wide">
                  Bank-Grade Security
                </h3>
                <p className="text-sm text-slate-600">
                  RBI compliant • PCI DSS Level 1 certified • End-to-end encrypted
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <span>Tokenized card storage</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <span>No CVV stored</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <span>Last 4 digits only</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <span>Network encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Payment Method Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Corporate Cards */}
        <Card className="border border-slate-200 bg-white hover:border-slate-300 transition-colors">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-slate-700" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-900">
                    Corporate Cards
                  </h3>
                  <p className="text-xs text-slate-500">
                    Credit & Debit
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Instant processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Visa, Mastercard, Amex</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Recurring payments</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Bank Accounts */}
        <Card className="border border-slate-200 bg-white hover:border-slate-300 transition-colors">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-slate-700" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-900">
                    Bank Accounts
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct Transfer
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>NEFT, RTGS, IMPS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Higher limits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Direct to vendors</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 4: Call-to-Action */}
      <div className="text-center space-y-3 pt-2">
        <Button 
          size="lg"
          onClick={() => navigate("/wallet/add")}
          className="h-11 px-8"
        >
          Add Payment Source
        </Button>
        
        <p className="text-sm text-slate-500">
          Add multiple sources and set a primary method
        </p>
      </div>
    </div>
  );
};
