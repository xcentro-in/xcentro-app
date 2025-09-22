import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import PayeeManagement from "./pages/PayeeManagement";
import Insights from "./pages/Insights";
import PaymentCalendar from "./pages/PaymentCalendar";
import ApprovalInbox from "./pages/ApprovalInbox";
import Rewards from "./pages/Rewards";
import RewardsInsights from "./pages/RewardsInsights";
import MilestoneRewards from "./pages/MilestoneRewards";
import CreditCards from "./pages/CreditCards";
import CreditCardBills from "./pages/CreditCardBills";
import CreditCardAnalytics from "./pages/CreditCardAnalytics";
import WalletManagement from "./pages/WalletManagement";
import AddPaymentMethod from "./pages/AddPaymentMethod";
import PayeeHistory from "./pages/PayeeHistory";
import TransactionDetails from "./pages/TransactionDetails";
import NewPayment from "./pages/NewPayment";
import PayInvoice from "./pages/PayInvoice";
import BusinessOnboarding from "./pages/BusinessOnboarding";
import RedemptionFlow from "./pages/RedemptionFlow";
import Network from "./pages/Network";
import CashFlowProjection from "./pages/CashFlowProjection";
import GSTReports from "./pages/GSTReports";
import GSTPaymentHistory from "./pages/GSTPaymentHistory";
import PayrollReport from "./pages/PayrollReport";
import Invoices from "./pages/Bills";
import NewBill from "./pages/NewBill";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import UserOnboarding from "./pages/UserOnboarding";

import Layout from "./components/Layout";
import { Toaster } from "./components/ui/sonner";

import { SidebarProvider } from "./components/ui/sidebar";
import ErrorBoundary from "./components/ErrorBoundary";
import SettingsLayout from "./components/settings/SettingsLayout";
import { canViewFeature } from "@/lib/featureFlags";
import { getUser } from "./lib/getUser";


const queryClient = new QueryClient()

function App() {
  const RewardsEnabled = canViewFeature("REWARD_POINT_SYSTEM", getUser());
  const AnalyticsEnabled = canViewFeature("BUSINESS_ANALYTICS", getUser());
  const CreditCardBillEnabled = canViewFeature("REWARD_POINT_SYSTEM", getUser());
  const ReferralEnabled = canViewFeature("REFERRAL_SYSTEM", getUser());

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <SidebarProvider>
            <Routes>
              <Route path="/onboarding" element={<UserOnboarding />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="payments" element={<Payments />} />
                <Route path="payment-calendar" element={<PaymentCalendar />} />
                <Route path="payees" element={<PayeeManagement />} />
                <Route path="payees/:payeeId" element={<PayeeHistory />} />
                <Route path="bills" element={<Invoices />} />
                <Route path="bills/new" element={<NewBill />} />
                <Route path="approvals" element={<ApprovalInbox />} />
                {AnalyticsEnabled && (
                  <>
                  <Route path="insights" element={<Insights />} />
                  <Route path="cash-flow-projection" element={<CashFlowProjection />} />
                  <Route path="gst-reports" element={<GSTReports />} />
                  <Route path="gst-payment-history" element={<GSTPaymentHistory />} />
                  <Route path="payroll-report" element={<PayrollReport />} />
                  </>
                )}
                <Route path="new-payment" element={<NewPayment />} />
                <Route path="pay-invoice" element={<PayInvoice />} />
                <Route path="payments/:id" element={<TransactionDetails />} />
                {RewardsEnabled && (
                  <>
                  <Route path="rewards" element={<Rewards />} />
                  <Route path="rewards/history" element={<RewardsInsights />} />
                  <Route path="rewards/milestones" element={<MilestoneRewards />} />
                  <Route path="rewards/redeem/:categoryId" element={<RedemptionFlow />} />
                  <Route path="rewards/redeem" element={<RedemptionFlow />} />
                  </>
                )}
                {ReferralEnabled && (
                  <Route path="network" element={<Network />} />
                )}
                {CreditCardBillEnabled && (
                  <>
                  <Route path="credit-cards" element={<CreditCards />} />
                  <Route path="credit-card-bills" element={<CreditCardBills />} />
                  <Route path="credit-card-analytics" element={<CreditCardAnalytics />} />
                  </>
                )}
                <Route path="wallet" element={<WalletManagement />} />
                <Route path="wallet/add" element={<AddPaymentMethod />} />
                <Route path="business-onboarding" element={<BusinessOnboarding />} />
              </Route>
              
              <Route path="/settings" element={<SettingsLayout />}>
                <Route index element={<Settings />} />
                <Route path="*" element={<Settings />} />
              </Route>
              
              
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </Router>
        <Toaster />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
