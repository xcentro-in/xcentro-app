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
          Payment Sources Configuration
        </h2>
        
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          Configure your corporate payment methods to enable vendor payments, 
          payroll processing, and bill settlements.
        </p>
      </div>

      {/* Section 2: Security & Compliance Card */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="pt-6">
          
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-slate-700" strokeWidth={1.5} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-medium text-slate-900 mb-1 uppercase tracking-wide">
                Security & Compliance
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All payment data is encrypted and processed in compliance with 
                Reserve Bank of India guidelines and PCI DSS Level 1 standards.
              </p>
            </div>
          </div>
          
          <div className="space-y-2.5 mt-4 pl-14">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-slate-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-600">
                Card details tokenized via certified payment gateway
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-slate-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-600">
                Only last 4 digits retained for transaction identification
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-slate-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-600">
                End-to-end encryption maintained by card networks
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-slate-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-600">
                No CVV or PIN values stored on any server
              </p>
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
                  <span>Instant transaction processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Support for Visa, Mastercard, Amex</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Scheduled & recurring payments</span>
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
                    Direct Transfers
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>NEFT, RTGS, IMPS support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Higher transaction limits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Direct vendor account transfers</span>
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
          className="h-11"
        >
          Configure Payment Sources
        </Button>
        
        <p className="text-sm text-slate-500">
          Add multiple payment sources and designate a primary method for automated transactions
        </p>
      </div>
    </div>
  );
};
