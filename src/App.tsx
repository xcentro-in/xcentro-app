
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Payments from "@/pages/Payments";
import NewPayment from "@/pages/NewPayment";
import PaymentCalendar from "@/pages/PaymentCalendar";
import PayeeManagement from "@/pages/PayeeManagement";
import ApprovalInbox from "@/pages/ApprovalInbox";
import Rewards from "@/pages/Rewards";
import RewardsHistory from "@/pages/RewardsHistory";
import Insights from "@/pages/Insights";
import Settings from "@/pages/Settings";
import WalletManagement from "@/pages/WalletManagement";
import AddPaymentMethod from "@/pages/AddPaymentMethod";
import TransactionDetails from "@/pages/TransactionDetails";
import UserAccess from "@/pages/UserAccess";
import RedemptionFlow from "@/pages/RedemptionFlow";
import BusinessOnboarding from "@/pages/BusinessOnboarding";
import NotFound from "@/pages/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="payments" element={<Payments />} />
          <Route path="new-payment" element={<NewPayment />} />
          <Route path="payment-calendar" element={<PaymentCalendar />} />
          <Route path="payees" element={<PayeeManagement />} />
          <Route path="wallet" element={<WalletManagement />} />
          <Route path="wallet/add-payment-method" element={<AddPaymentMethod />} />
          <Route path="approvals" element={<ApprovalInbox />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="rewards/history" element={<RewardsHistory />} />
          <Route path="rewards/redeem" element={<RedemptionFlow />} />
          <Route path="insights" element={<Insights />} />
          <Route path="settings" element={<Settings />} />
          <Route path="transactions/:id" element={<TransactionDetails />} />
          <Route path="user-access" element={<UserAccess />} />
          <Route path="settings/business/new" element={<BusinessOnboarding />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
