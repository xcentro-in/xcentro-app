/**
 * Centralized Onboarding Router Service
 *
 * Single source of truth for determining user routing based on onboarding status.
 * Eliminates race conditions and duplicate API calls by using data from AuthContext.
 *
 * Flow:
 * 1. Not authenticated → /login
 * 2. No roles:
 *    - KYB incomplete → /business-onboarding
 *    - KYC incomplete → /onboarding
 *    - Both complete → /pending-approval (waiting for role assignment)
 * 3. Has roles:
 *    - KYC needed → /onboarding
 *    - Role = "none" → /pending-approval
 *    - Fully onboarded → /dashboard (or any app page)
 */

import { UserRole } from '@/contexts/AuthContext';
import { AuthUser } from '@/types/auth';
import { isStatusComplete } from '@/constants/onboarding';

export interface OnboardingStatus {
  kybStatus?: string;
  kybInitiated?: boolean;
  kycStatus?: string;
}

export interface RoutingDecision {
  shouldNavigate: boolean;
  targetRoute: string;
  reason: string;
}

// Route constants
const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  BUSINESS_ONBOARDING: '/business-onboarding',
  USER_ONBOARDING: '/onboarding',
  PENDING_APPROVAL: '/pending-approval',
} as const;

// Pages that don't require full app access (onboarding/auth flows)
const AUTH_PAGES = [
  '/login',
  '/signup',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/business-onboarding',
  '/onboarding',
  '/pending-approval'
];

/**
 * Determine target route based on user onboarding status
 */
const getTargetRoute = (
  userRoles: UserRole[],
  onboardingStatus: OnboardingStatus | null
): { route: string; reason: string } => {
  const hasRoles = userRoles && userRoles.length > 0;

  // No roles: Check KYB → KYC → Pending
  if (!hasRoles) {
    const isKybComplete = isStatusComplete(onboardingStatus?.kybStatus);
    const isKycComplete = isStatusComplete(onboardingStatus?.kycStatus);

    if (!isKybComplete) {
      return { route: ROUTES.BUSINESS_ONBOARDING, reason: 'Business onboarding incomplete' };
    }
    if (!isKycComplete) {
      return { route: ROUTES.USER_ONBOARDING, reason: 'User KYC incomplete' };
    }
    return { route: ROUTES.PENDING_APPROVAL, reason: 'Waiting for role assignment' };
  }

  // Has roles: Check KYC needed → Role "none" → Fully onboarded
  const primaryRole = userRoles[0];

  if (primaryRole.kycNeeded) {
    return { route: ROUTES.USER_ONBOARDING, reason: 'User KYC verification required' };
  }
  if (primaryRole.role === 'none') {
    return { route: ROUTES.PENDING_APPROVAL, reason: 'Pending role approval' };
  }
  return { route: ROUTES.DASHBOARD, reason: 'User fully onboarded' };
};

/**
 * Create routing decision
 */
const createRoutingDecision = (
  shouldNavigate: boolean,
  targetRoute: string,
  reason: string
): RoutingDecision => ({
  shouldNavigate,
  targetRoute,
  reason
});

/**
 * Determine the correct route for a user based on their authentication and onboarding status
 */
export const determineUserRoute = (
  currentPath: string,
  user: AuthUser | null,
  userRoles: UserRole[],
  onboardingStatus: OnboardingStatus | null
): RoutingDecision => {
  // Not authenticated → Login
  if (!user) {
    const shouldNavigate = currentPath !== ROUTES.LOGIN;
    return createRoutingDecision(shouldNavigate, ROUTES.LOGIN, 'User not authenticated');
  }

  // Determine target route based on user status
  const { route: targetRoute, reason } = getTargetRoute(userRoles, onboardingStatus);

  // Already on target route
  if (currentPath === targetRoute) {
    return createRoutingDecision(false, currentPath, `Already on ${currentPath}`);
  }

  // Fully onboarded: Allow all app pages, only redirect if on auth page
  if (targetRoute === ROUTES.DASHBOARD) {
    const isOnAuthPage = AUTH_PAGES.includes(currentPath);
    if (isOnAuthPage) {
      return createRoutingDecision(true, ROUTES.DASHBOARD, 'Redirect to dashboard');
    }
    return createRoutingDecision(false, currentPath, 'Accessing app page');
  }

  // Navigate to onboarding/pending route
  return createRoutingDecision(true, targetRoute, reason);
};

/**
 * Check if a route requires authentication
 */
export const isProtectedRoute = (path: string): boolean => {
  const publicRoutes = ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password'];
  return !publicRoutes.includes(path);
};

/**
 * Check if a route is an onboarding/auth page
 */
export const isOnboardingRoute = (path: string): boolean => {
  return AUTH_PAGES.includes(path);
};
