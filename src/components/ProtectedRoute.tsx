import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { determineUserRoute } from '@/services/onboardingRouter';
import BusinessSelectorModal from '@/components/auth/BusinessSelectorModal';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const {
    isAuthenticated,
    isLoading,
    user,
    businesses,
    activeBid,
    onboardingStatus,
    needsBusinessSelection,
  } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const routingDecision = determineUserRoute(
    location.pathname,
    user,
    businesses,
    activeBid,
    onboardingStatus,
    needsBusinessSelection
  );

  // Show business selector modal (blocking overlay, no route change)
  if (routingDecision.needsModal) {
    return <BusinessSelectorModal />;
  }

  if (routingDecision.shouldNavigate) {
    console.log('[ProtectedRoute]', routingDecision.reason, '→', routingDecision.targetRoute);
    return <Navigate to={routingDecision.targetRoute} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
