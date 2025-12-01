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
  const [shouldRender, setShouldRender] = useState(false);

  // Check onboarding status when authenticated and user data is loaded
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Wait for auth to finish loading
      if (isLoading) {
        setShouldRender(false);
        return;
      }

      // If not authenticated, we'll redirect to login (handled below)
      if (!isAuthenticated) {
        setShouldRender(true);
        return;
      }

      const routingDecision = determineUserRoute(
        location.pathname,
        user,
        userRoles,
        onboardingStatus
      );


      if (routingDecision.shouldNavigate) {
        // Don't render children when redirecting
        setShouldRender(false);
        navigate(routingDecision.targetRoute, { replace: true });
      } else {
        // Safe to render children
        setShouldRender(true);
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, isLoading, location.pathname, navigate, user, userRoles, onboardingStatus]);

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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;