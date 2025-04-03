
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import RewardsHistory from "./pages/RewardsHistory";
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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import Layout from "./components/Layout";
import { Toaster } from "./components/ui/toaster";

import { SidebarProvider } from "./components/ui/sidebar";
import ErrorBoundary from "./components/ErrorBoundary";

// Create a client
const queryClient = new QueryClient()

function App() {
  const { toast } = useToast();

  useEffect(() => {
    // Demo welcome toast
    setTimeout(() => {
      toast({
        title: "Welcome to your business banking dashboard",
        description: "Manage all your business finances in one place.",
      });
    }, 1000);
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="payments" element={<Payments />} />
                <Route path="payment-calendar" element={<PaymentCalendar />} />
                <Route path="payees" element={<PayeeManagement />} />
                <Route path="payees/:payeeId" element={<PayeeHistory />} />
                <Route path="approvals" element={<ApprovalInbox />} />
                <Route path="insights" element={<Insights />} />
                <Route path="new-payment" element={<NewPayment />} />
                <Route path="pay-invoice" element={<PayInvoice />} />
                <Route path="payments/:transactionId" element={<TransactionDetails />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path="rewards/history" element={<RewardsHistory />} />
                <Route path="rewards/redeem/:categoryId" element={<RedemptionFlow />} />
                <Route path="rewards/redeem" element={<RedemptionFlow />} />
                <Route path="credit-cards" element={<CreditCards />} />
                <Route path="credit-card-bills" element={<CreditCardBills />} />
                <Route path="credit-card-analytics" element={<CreditCardAnalytics />} />
                <Route path="wallet" element={<WalletManagement />} />
                <Route path="wallet/add-payment-method" element={<AddPaymentMethod />} />
                <Route path="settings/*" element={<Settings />} />
                <Route path="user-access" element={<UserAccess />} />
                <Route path="business-onboarding" element={<BusinessOnboarding />} />
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
