/**
 * Centralized Onboarding Router Service
 *
 * Single source of truth for determining user routing based on session state.
 * All data comes from AuthContext (verify-session response) — no extra API calls.
 *
 * Routing order:
 * 1. Not authenticated → /login
 * 2. No businesses → /business-onboarding (brand new user)
 * 3. 2+ businesses, no confirmed selection → show BusinessSelectorModal (needsModal flag)
 * 4. KYB incomplete on selected business → /business-onboarding
 * 5. KYC incomplete (global user-level) → /onboarding
 * 6. role === "none" or role === "" → /pending-approval
 * 7. Fully onboarded → allow through
 */

import { SessionBusiness, AuthUser } from '@/types/auth';
import { isStatusComplete } from '@/constants/onboarding';

export interface RoutingDecision {
  shouldNavigate: boolean;
  targetRoute: string;
  reason: string;
  needsModal?: boolean;
}

const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  BUSINESS_ONBOARDING: '/business-onboarding',
  USER_ONBOARDING: '/onboarding',
  PENDING_APPROVAL: '/pending-approval',
} as const;

const AUTH_PAGES = [
  '/login',
  '/signup',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/business-onboarding',
  '/onboarding',
  '/pending-approval',
];

const createDecision = (
  shouldNavigate: boolean,
  targetRoute: string,
  reason: string,
  needsModal = false
): RoutingDecision => ({ shouldNavigate, targetRoute, reason, needsModal });

/**
 * Determine the correct route for a user based on their session state.
 */
export const determineUserRoute = (
  currentPath: string,
  user: AuthUser | null,
  businesses: SessionBusiness[],
  activeBid: string | null,
  _onboardingStatus: any, // kept for signature compatibility, not used for routing
  needsBusinessSelection = false
): RoutingDecision => {
  // Step 1: Not authenticated
  if (!user) {
    const shouldNavigate = currentPath !== ROUTES.LOGIN;
    return createDecision(shouldNavigate, ROUTES.LOGIN, 'User not authenticated');
  }

  // Step 2: No businesses — brand new user
  if (!businesses || businesses.length === 0) {
    if (currentPath === ROUTES.BUSINESS_ONBOARDING) {
      return createDecision(false, currentPath, 'Already on business onboarding');
    }
    return createDecision(true, ROUTES.BUSINESS_ONBOARDING, 'No businesses — fresh user');
  }

  // Step 3: Multiple businesses, user hasn't confirmed selection yet
  if (needsBusinessSelection) {
    return createDecision(false, currentPath, 'Business selection required', true);
  }

  // Step 4: Find selected business
  const selectedBusiness = businesses.find(b => b.bid === activeBid) || businesses[0];

  // Step 5: KYB check (selected business only)
  if (!isStatusComplete(selectedBusiness.kyb_status)) {
    if (currentPath === ROUTES.BUSINESS_ONBOARDING) {
      return createDecision(false, currentPath, 'Already on business onboarding');
    }
    return createDecision(true, ROUTES.BUSINESS_ONBOARDING, 'KYB incomplete');
  }

  // Step 6: KYC check (global user-level only — kyc_needed is not used for routing)
  if (!isStatusComplete(user.kyc_status)) {
    if (currentPath === ROUTES.USER_ONBOARDING) {
      return createDecision(false, currentPath, 'Already on user onboarding');
    }
    return createDecision(true, ROUTES.USER_ONBOARDING, 'KYC incomplete');
  }

  // Step 7: Role check — "none" or "" both mean role not yet assigned
  if (selectedBusiness.role === 'none' || selectedBusiness.role === '') {
    if (currentPath === ROUTES.PENDING_APPROVAL) {
      return createDecision(false, currentPath, 'Already on pending approval');
    }
    return createDecision(true, ROUTES.PENDING_APPROVAL, 'Pending role approval');
  }

  // Step 8: Fully onboarded — allow through
  if (AUTH_PAGES.includes(currentPath)) {
    return createDecision(true, ROUTES.DASHBOARD, 'Redirect authenticated user to dashboard');
  }
  return createDecision(false, currentPath, 'User fully onboarded');
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
