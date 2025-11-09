import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI, businessAPI } from '@/services/api';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
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
          const rolesResponse = await userAPI.getRoles();
          const roles = rolesResponse.data;
          console.log('[ProtectedRoute] Roles:', roles);

          if (roles.length === 0) {
            // NO ROLES: Check onboarding status
            try {
              const businessStatus = await businessAPI.getOnboardingStatus();
              const kybStatus = businessStatus.data.kybStatus;
              console.log('[ProtectedRoute] Business status:', kybStatus);

              if (kybStatus === "kyc_completed" || kybStatus === "kyc_verified") {
                // Business complete, check user onboarding
                try {
                  const userStatus = await userAPI.getOnboardingStatus();
                  const kycStatus = userStatus.data.kycStatus;
                  console.log('[ProtectedRoute] User status:', kycStatus);

                  if (kycStatus === "kyc_not_started" || kycStatus === "kyc_in_progress") {
                    console.log('[ProtectedRoute] Redirecting to user onboarding');
                    navigate('/onboarding', { replace: true });
                    return;
                  }
                } catch (error) {
                  console.log('[ProtectedRoute] User status error, redirecting to user onboarding');
                  navigate('/onboarding', { replace: true });
                  return;
                }
              } else {
                // Business not complete, redirect to business onboarding
                console.log('[ProtectedRoute] Redirecting to business onboarding');
                navigate('/business-onboarding', { replace: true });
                return;
              }
            } catch (error) {
              // No business onboarding started
              console.log('[ProtectedRoute] No business found, redirecting to business onboarding');
              navigate('/business-onboarding', { replace: true });
              return;
            }
          } else {
            // HAS ROLES: Check if onboarding complete
            const primaryRole = roles[0];
            console.log('[ProtectedRoute] Primary role:', primaryRole);

            if (primaryRole.role === "none" && !primaryRole.kycNeeded) {
              console.log('[ProtectedRoute] Redirecting to pending approval');
              navigate('/pending-approval', { replace: true });
              return;
            } else if (primaryRole.kycNeeded) {
              console.log('[ProtectedRoute] Redirecting to user onboarding');
              navigate('/onboarding', { replace: true });
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
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

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