import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { determineUserRoute } from '@/services/onboardingRouter';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, userRoles, onboardingStatus } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // Check onboarding status when authenticated and user data is loaded
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Wait for auth to finish loading
      if (isLoading) {
        return;
      }

      // If not authenticated, we'll redirect to login (handled below)
      if (!isAuthenticated) {
        setIsCheckingOnboarding(false);
        return;
      }

      // Use centralized routing logic
      console.log('[ProtectedRoute] Checking user route...', {
        path: location.pathname,
        hasUser: !!user,
        rolesCount: userRoles?.length || 0,
        onboardingStatus
      });

      const routingDecision = determineUserRoute(
        location.pathname,
        user,
        userRoles,
        onboardingStatus
      );

      console.log('[ProtectedRoute] Routing decision:', routingDecision);

      if (routingDecision.shouldNavigate) {
        console.log(`[ProtectedRoute] Navigating to ${routingDecision.targetRoute}: ${routingDecision.reason}`);
        navigate(routingDecision.targetRoute, { replace: true });
      }

      setIsCheckingOnboarding(false);
    };

    checkOnboardingStatus();
  }, [isAuthenticated, isLoading, location.pathname, navigate, user, userRoles, onboardingStatus]);

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