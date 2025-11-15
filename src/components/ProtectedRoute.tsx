import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI, businessAPI } from '@/services/api';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, userRoles } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // Check onboarding status when authenticated
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (isAuthenticated && !isLoading) {
        // Skip onboarding check if user is already on onboarding pages
        const onboardingPaths = ['/business-onboarding', '/onboarding', '/pending-approval', '/login'];
        if (onboardingPaths.includes(location.pathname)) {
          setIsCheckingOnboarding(false);
          return;
        }

        try {
          console.log('[ProtectedRoute] Checking onboarding status...');
          // Use roles from AuthContext instead of fetching again
          const roles = userRoles || [];
          console.log('[ProtectedRoute] Roles from AuthContext:', roles);

          if (roles.length === 0) {
            // NO ROLES: Check KYB and KYC status to determine next step

            // Step 1: Check business onboarding status (KYB)
            try {
              const businessStatus = await businessAPI.getOnboardingStatus();
              const kybStatus = businessStatus.data.kybStatus;
              const isKybComplete = kybStatus === "kyc_completed" || kybStatus === "kyc_verified";

              console.log('[ProtectedRoute] KYB status:', kybStatus, '- Complete:', isKybComplete);

              if (isKybComplete) {
                // KYB complete, now check user KYC status
                try {
                  const userStatus = await userAPI.getOnboardingStatus();
                  const kycStatus = userStatus.data.kycStatus;
                  const isKycComplete = kycStatus === "kyc_completed" || kycStatus === "kyc_verified";

                  console.log('[ProtectedRoute] KYC status:', kycStatus, '- Complete:', isKycComplete);

                  if (isKycComplete) {
                    // Both KYB and KYC complete, but no roles assigned - pending approval
                    console.log('[ProtectedRoute] Both KYB and KYC complete but no roles, redirecting to pending-approval');
                    navigate('/pending-approval', { replace: true });
                    return;
                  } else {
                    // KYC not complete, redirect to user onboarding
                    console.log('[ProtectedRoute] KYC not complete, redirecting to user onboarding');
                    navigate('/onboarding', { replace: true });
                    return;
                  }
                } catch (error) {
                  // No user onboarding found, redirect to start KYC
                  console.log('[ProtectedRoute] No user onboarding found, redirecting to user onboarding');
                  navigate('/onboarding', { replace: true });
                  return;
                }
              } else {
                // KYB not complete, redirect to business onboarding
                console.log('[ProtectedRoute] KYB not complete, redirecting to business-onboarding');
                navigate('/business-onboarding', { replace: true });
                return;
              }
            } catch (error) {
              // No business found, start business onboarding
              console.log('[ProtectedRoute] No business found, redirecting to business-onboarding');
              navigate('/business-onboarding', { replace: true });
              return;
            }
          } else {
            // HAS ROLES: Check if onboarding complete
            const primaryRole = roles[0];
            console.log('[ProtectedRoute] Primary role:', primaryRole);

            if (primaryRole.kycNeeded) {
              // KYC needed, check if already completed
              try {
                const userStatus = await userAPI.getOnboardingStatus();
                const kycStatus = userStatus.data.kycStatus;
                const isKycComplete = kycStatus === "kyc_completed" || kycStatus === "kyc_verified";

                console.log('[ProtectedRoute] KYC status (with roles):', kycStatus, '- Complete:', isKycComplete);

                if (isKycComplete) {
                  // KYC already complete, allow access (roles will be updated on next refresh)
                  console.log('[ProtectedRoute] KYC complete with roles, allowing access');
                } else {
                  // KYC not complete, redirect to onboarding
                  console.log('[ProtectedRoute] KYC not complete, redirecting to user onboarding');
                  navigate('/onboarding', { replace: true });
                  return;
                }
              } catch (error) {
                // Can't get KYC status, redirect to onboarding to be safe
                console.log('[ProtectedRoute] Cannot get KYC status, redirecting to user onboarding');
                navigate('/onboarding', { replace: true });
                return;
              }
            } else if (primaryRole.role === "none") {
              // Role is "none", pending approval
              console.log('[ProtectedRoute] Role is none, redirecting to pending approval');
              navigate('/pending-approval', { replace: true });
              return;
            }
            // Otherwise, user is fully onboarded - allow access
          }

          setIsCheckingOnboarding(false);
        } catch (error) {
          console.error('[ProtectedRoute] Error checking onboarding:', error);
          setIsCheckingOnboarding(false);
        }
      } else {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, isLoading, location.pathname, navigate, userRoles]);

  // Show loading state while checking authentication
  if (isLoading || isCheckingOnboarding) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;