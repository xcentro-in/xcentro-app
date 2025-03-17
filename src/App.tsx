
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import Rewards from "./pages/Rewards";
import RewardsHistory from "./pages/RewardsHistory";
import RedemptionFlow from "./pages/RedemptionFlow";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import NewPayment from "./pages/NewPayment";
import PayeeManagement from "./pages/PayeeManagement";
import WalletManagement from "./pages/WalletManagement";
import AddPaymentMethod from "./pages/AddPaymentMethod";
import ApprovalInbox from "./pages/ApprovalInbox";
import TransactionDetails from "./pages/TransactionDetails";
import PaymentCalendar from "./pages/PaymentCalendar";
import BusinessOnboarding from "./pages/BusinessOnboarding";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SidebarProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="payments/:id" element={<TransactionDetails />} />
                  <Route path="new-payment" element={<NewPayment />} />
                  <Route path="payment-calendar" element={<PaymentCalendar />} />
                  <Route path="payees" element={<PayeeManagement />} />
                  <Route path="wallet" element={<WalletManagement />} />
                  <Route path="wallet/add" element={<AddPaymentMethod />} />
                  <Route path="insights" element={<Insights />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="rewards" element={<Rewards />} />
                  <Route path="rewards/history" element={<RewardsHistory />} />
                  <Route path="rewards/redeem/:categoryId" element={<RedemptionFlow />} />
                  <Route path="rewards/redeem/:categoryId/:itemId" element={<RedemptionFlow />} />
                  <Route path="approvals" element={<ApprovalInbox />} />
                  <Route path="approvals/:id" element={<TransactionDetails />} />
                  <Route path="business-onboarding" element={<BusinessOnboarding />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
