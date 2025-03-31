
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Payments from "./pages/Payments";
import UpcomingPayments from "./pages/UpcomingPayments";
import NewPayment from "./pages/NewPayment";
import TransactionDetails from "./pages/TransactionDetails";
import CreditCards from "./pages/CreditCards";
import CreditCardBills from "./pages/CreditCardBills";
import CreditCardAnalytics from "./pages/CreditCardAnalytics";
import Insights from "./pages/Insights";
import ApprovalInbox from "./pages/ApprovalInbox";
import WalletManagement from "./pages/WalletManagement";
import AddPaymentMethod from "./pages/AddPaymentMethod";
import PayeeManagement from "./pages/PayeeManagement";
import PayeeHistory from "./pages/PayeeHistory";
import BusinessOnboarding from "./pages/BusinessOnboarding";
import Settings from "./pages/Settings";
import UserAccess from "./pages/UserAccess";
import PayInvoice from "./pages/PayInvoice";
import Rewards from "./pages/Rewards";
import RewardsHistory from "./pages/RewardsHistory";
import RedemptionFlow from "./pages/RedemptionFlow";
import PaymentCalendar from "./pages/PaymentCalendar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="payments" element={<Payments />} />
          <Route path="upcoming-payments" element={<UpcomingPayments />} />
          <Route path="new-payment" element={<NewPayment />} />
          <Route path="payments/:id" element={<TransactionDetails />} />
          <Route path="payment-calendar" element={<PaymentCalendar />} />
          <Route path="credit-cards" element={<CreditCards />} />
          <Route path="credit-card-bills" element={<CreditCardBills />} />
          <Route path="credit-card-analytics" element={<CreditCardAnalytics />} />
          <Route path="insights" element={<Insights />} />
          <Route path="approvals" element={<ApprovalInbox />} />
          <Route path="wallet" element={<WalletManagement />} />
          <Route path="add-payment-method" element={<AddPaymentMethod />} />
          <Route path="payees" element={<PayeeManagement />} />
          <Route path="payee/:id" element={<PayeeHistory />} />
          <Route path="business-onboarding" element={<BusinessOnboarding />} />
          <Route path="settings" element={<Settings />} />
          <Route path="user-access" element={<UserAccess />} />
          <Route path="pay-invoice" element={<PayInvoice />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="rewards-history" element={<RewardsHistory />} />
          <Route path="redemption" element={<RedemptionFlow />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
