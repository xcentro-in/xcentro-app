
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopNav from "./TopNav";
import { useEffect, useRef } from "react";
import { PageTitleProvider } from "@/contexts/PageTitleContext";
import { userAPI, businessAPI, authAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";

const Layout = () => {
  const { user, updateUser, activeBid } = useAuth();
  const { updateBusinessDetails } = useBusiness();
  const bootstrappedBidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!activeBid) {
      // Reset on logout so re-login to the same business bootstraps fresh
      bootstrappedBidRef.current = null;
      return;
    }
    // Already bootstrapped for this business — skip
    if (bootstrappedBidRef.current === activeBid) return;
    bootstrappedBidRef.current = activeBid;

    const bootstrap = async () => {
      const [profileRes, businessRes, onboardingRes] = await Promise.allSettled([
        // Profile only needed once — skip if name already set
        user?.name ? Promise.resolve(null) : userAPI.getProfile(),
        businessAPI.getBusiness(),  // always re-fetch on business switch (businessType resets to '')
        authAPI.getOnboardingStatus(),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        const p = profileRes.value.data;
        updateUser({ name: p.name, email: p.email, mobile: p.mobile, taxId: p.taxId, maskedNationalId: p.maskedNationalId });
      }

      if (businessRes.status === 'fulfilled' && businessRes.value?.data) {
        const b = businessRes.value.data;
        updateBusinessDetails({ gstin: b.gstin, pan: b.pan, businessType: b.businessType });
      }

      if (onboardingRes.status === 'fulfilled' && onboardingRes.value?.data) {
        const flags = onboardingRes.value.data;
        updateUser({
          hasAddedPaymentMethod: flags.hasAddedPaymentMethod,
          hasAddedVendor: flags.hasAddedVendor,
          hasCreatedFirstPayment: flags.hasCreatedFirstPayment,
          showDashboard: flags.showDashboard,
        });
      }
    };

    bootstrap();
  }, [activeBid]);  // re-runs on business switch

  return (
    <PageTitleProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </PageTitleProvider>
  );
};

export default Layout;
