import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { determineUserRoute } from '@/services/onboardingRouter';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, userRoles, onboardingStatus } = useAuth();
  const location = useLocation();
  const [shouldRender, setShouldRender] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  // Check onboarding status when authenticated and user data is loaded
  useEffect(() => {
    const checkOnboardingStatus = () => {
      // Wait for auth to finish loading
      if (isLoading) {
        setShouldRender(false);
        setRedirectTarget(null);
        return;
      }

      // If not authenticated, redirect to login (handled by Navigate below)
      if (!isAuthenticated) {
        setShouldRender(false);
        setRedirectTarget('/login');
        return;
      }

      // Determine where user should be based on onboarding status
      const routingDecision = determineUserRoute(
        location.pathname,
        user,
        userRoles,
        onboardingStatus
      );

      if (routingDecision.shouldNavigate) {
        // Need to redirect to different route
        console.log('[ProtectedRoute]', routingDecision.reason, '→', routingDecision.targetRoute);
        setShouldRender(false);
        setRedirectTarget(routingDecision.targetRoute);
      } else {
        // User is on correct route, safe to render
        setShouldRender(true);
        setRedirectTarget(null);
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, isLoading, location.pathname, user, userRoles, onboardingStatus]);

  // Redirect if needed (React Router navigation)
  if (redirectTarget) {
    return <Navigate to={redirectTarget} state={{ from: location }} replace />;
  }

  // Show loading state while checking authentication or determining route
  if (isLoading || !shouldRender) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;