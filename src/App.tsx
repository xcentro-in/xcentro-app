
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import Rewards from "./pages/Rewards";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import NewPayment from "./pages/NewPayment";
import PayeeManagement from "./pages/PayeeManagement";
import WalletManagement from "./pages/WalletManagement";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/new-payment" element={<NewPayment />} />
                <Route path="/payees" element={<PayeeManagement />} />
                <Route path="/wallet" element={<WalletManagement />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
