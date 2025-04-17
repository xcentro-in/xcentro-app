import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useToast } from "./hooks/use-toast";
import { useEffect } from "react";
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
import UserAccess from "./pages/UserAccess";
import BusinessOnboarding from "./pages/BusinessOnboarding";
import RedemptionFlow from "./pages/RedemptionFlow";
import Network from "./pages/Network";
import CashFlowProjection from "./pages/CashFlowProjection";
import GSTReports from "./pages/GSTReports";
import GSTPaymentHistory from "./pages/GSTPaymentHistory";
import PayrollReport from "./pages/PayrollReport";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import UserOnboarding from "./pages/UserOnboarding";

import Layout from "./components/Layout";
import { Toaster } from "./components/ui/sonner";

import { SidebarProvider } from "./components/ui/sidebar";
import ErrorBoundary from "./components/ErrorBoundary";
import SettingsLayout from "./components/settings/SettingsLayout";

const queryClient = new QueryClient()

const isAuthenticated = () => {
  // Replace with your actual authentication check
  return localStorage.getItem('token') !== null;
};

const ProtectedRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};


function App() {
  const { toast } = useToast();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <SidebarProvider>
            <Routes>
              <Route path="/onboarding" element={<UserOnboarding />} />
              <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
                <Route index element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="payments" element={<ProtectedRoute element={<Payments />} />} />
                <Route path="payment-calendar" element={<ProtectedRoute element={<PaymentCalendar />} />} />
                <Route path="payees" element={<ProtectedRoute element={<PayeeManagement />} />} />
                <Route path="payees/:payeeId" element={<ProtectedRoute element={<PayeeHistory />} />} />
                <Route path="approvals" element={<ProtectedRoute element={<ApprovalInbox />} />} />
                <Route path="insights" element={<ProtectedRoute element={<Insights />} />} />
                <Route path="cash-flow-projection" element={<ProtectedRoute element={<CashFlowProjection />} />} />
                <Route path="gst-reports" element={<ProtectedRoute element={<GSTReports />} />} />
                <Route path="gst-payment-history" element={<ProtectedRoute element={<GSTPaymentHistory />} />} />
                <Route path="payroll-report" element={<ProtectedRoute element={<PayrollReport />} />} />
                <Route path="new-payment" element={<ProtectedRoute element={<NewPayment />} />} />
                <Route path="pay-invoice" element={<ProtectedRoute element={<PayInvoice />} />} />
                <Route path="payments/:id" element={<ProtectedRoute element={<TransactionDetails />} />} />
                <Route path="rewards" element={<ProtectedRoute element={<Rewards />} />} />
                <Route path="rewards/history" element={<ProtectedRoute element={<RewardsInsights />} />} />
                <Route path="rewards/milestones" element={<ProtectedRoute element={<MilestoneRewards />} />} />
                <Route path="rewards/redeem/:categoryId" element={<ProtectedRoute element={<RedemptionFlow />} />} />
                <Route path="rewards/redeem" element={<ProtectedRoute element={<RedemptionFlow />} />} />
                <Route path="network" element={<ProtectedRoute element={<Network />} />} />
                <Route path="credit-cards" element={<ProtectedRoute element={<CreditCards />} />} />
                <Route path="credit-card-bills" element={<ProtectedRoute element={<CreditCardBills />} />} />
                <Route path="credit-card-analytics" element={<ProtectedRoute element={<CreditCardAnalytics />} />} />
                <Route path="wallet" element={<ProtectedRoute element={<WalletManagement />} />} />
                <Route path="wallet/add" element={<ProtectedRoute element={<AddPaymentMethod />} />} />
                <Route path="user-access" element={<ProtectedRoute element={<UserAccess />} />} />
                <Route path="business-onboarding" element={<ProtectedRoute element={<BusinessOnboarding />} />} />
              </Route>

              <Route path="/settings" element={<ProtectedRoute element={<SettingsLayout />} />}>
                <Route index element={<ProtectedRoute element={<Settings />} />} />
                <Route path="*" element={<ProtectedRoute element={<Settings />} />} />
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