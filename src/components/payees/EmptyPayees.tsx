import { Users, Shield, BanknoteIcon, LightbulbIcon, UsersIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyPayeesProps {
  onAddPayee?: () => void;
}

export const EmptyPayees = ({ onAddPayee }: EmptyPayeesProps) => {

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 animate-fade-in">

      {/* Section 1: Header */}
      <div className="space-y-3 text-center">
        <div className="mx-auto w-16 h-16 rounded-lg border-2 border-slate-300 bg-white flex items-center justify-center">
          <Users className="h-8 w-8 text-slate-600" strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Add Your First Payee
        </h2>

        <p className="text-base text-slate-600 max-w-xl mx-auto">
          Payees are the recipients of your payments - vendors, employees, and service providers.
          Add them once, pay anytime.
        </p>
      </div>

      {/* Section 2: What are Payees? */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="pt-6">

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-slate-700" strokeWidth={1.5} />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-1 uppercase tracking-wide">
                  Verified & Secure
                </h3>
                <p className="text-sm text-slate-600">
                  All payees undergo bank account verification • GST validation • Cross-check with GSTN database
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <span>Bank account verification</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <span>GSTIN validation</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <span>Name matching check</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <span>Secure data storage</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Payee Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Vendors/Suppliers */}
        <Card className="border border-slate-200 bg-white hover:border-slate-300 transition-colors">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-center">
                  <BanknoteIcon className="h-5 w-5 text-blue-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-900">
                    Vendors
                  </h3>
                  <p className="text-xs text-slate-500">
                    Suppliers & Services
                  </p>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Settle invoices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Track payment history</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>GST compliance</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Biller Payees */}
        <Card className="border border-slate-200 bg-white hover:border-slate-300 transition-colors">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-center">
                  <LightbulbIcon className="h-5 w-5 text-yellow-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-900">
                    Billers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Utilities & Subscriptions
                  </p>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Electricity, water, gas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Internet & mobile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Recurring payments</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Payroll/Employees */}
        <Card className="border border-slate-200 bg-white hover:border-slate-300 transition-colors">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-green-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-900">
                    Employees
                  </h3>
                  <p className="text-xs text-slate-500">
                    Salary Disbursement
                  </p>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Monthly salaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Bulk payroll processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Compliance ready</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 4: How it Works */}
      <Card className="border border-blue-200 bg-blue-50/50 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-slate-900 mb-4 uppercase tracking-wide">
            How It Works
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                1
              </div>
              <div>
                <p className="font-medium text-slate-900 mb-1">Add Details</p>
                <p className="text-slate-600">Enter name, bank account, and GSTIN (for vendors)</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                2
              </div>
              <div>
                <p className="font-medium text-slate-900 mb-1">Verification</p>
                <p className="text-slate-600">System validates bank account and GST details</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                3
              </div>
              <div>
                <p className="font-medium text-slate-900 mb-1">Ready to Pay</p>
                <p className="text-slate-600">Make instant or scheduled payments anytime</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Call-to-Action */}
      <div className="text-center space-y-3 pt-2">
        <Button
          size="lg"
          onClick={onAddPayee}
          className="h-11 px-8"
        >
          Add Your First Payee
        </Button>

        <p className="text-sm text-slate-500">
          Add vendors, employees, or billers and start making payments
        </p>
      </div>
    </div>
  );
};
