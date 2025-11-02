import { AuthUser } from "@/types/auth";
import { UserPermissions } from "@/types/permissions";

export type AccessRequirement =
  | 'none'
  | 'payment-method'
  | 'vendor'
  | 'first-payment'
  | 'all-onboarding'
  | 'permission-based'; // New requirement type for role-based permissions

export interface NavigationAccessRule {
  requirement: AccessRequirement;
  lockedMessage: string;
  unlockHint: string;
  permissionKey?: keyof UserPermissions; // Optional permission key to check
}

export const navigationAccessRules: Record<string, NavigationAccessRule> = {
  // Dashboard - always accessible
  dashboard: {
    requirement: 'none',
    lockedMessage: '',
    unlockHint: '',
  },
  
  // Wallet - always accessible (to add payment methods)
  wallet: {
    requirement: 'none',
    lockedMessage: '',
    unlockHint: '',
  },
  
  // Manage Payees - requires payment method
  managepayees: {
    requirement: 'payment-method',
    lockedMessage: 'Add a payment method first',
    unlockHint: 'You need to add at least one payment method before managing payees.',
  },
  
  // New Payment - requires payment method AND vendor
  newpayment: {
    requirement: 'vendor',
    lockedMessage: 'Complete setup to make payments',
    unlockHint: 'Add a payment method and at least one vendor to start making payments.',
  },
  
  // Payment History - requires first payment
  paymenthistory: {
    requirement: 'first-payment',
    lockedMessage: 'No payment history yet',
    unlockHint: 'Process your first payment to view payment history.',
  },
  
  // Upcoming Payments - requires first payment
  upcomingpayments: {
    requirement: 'first-payment',
    lockedMessage: 'No upcoming payments',
    unlockHint: 'Schedule your first payment to view upcoming payments.',
  },
  
  // Bills - requires first payment
  bills: {
    requirement: 'first-payment',
    lockedMessage: 'No bills to manage yet',
    unlockHint: 'Create your first payment to start managing bills.',
  },
  
  // Approvals - requires canViewApprovals permission (owner role)
  approvals: {
    requirement: 'permission-based',
    lockedMessage: 'Access restricted',
    unlockHint: 'Only users with approval rights can access this section.',
    permissionKey: 'canViewApprovals',
  },
  
  // GST Payments - requires all onboarding
  gst: {
    requirement: 'all-onboarding',
    lockedMessage: 'Complete onboarding first',
    unlockHint: 'Complete all onboarding steps to access GST payments.',
  },
  
  // Credit Card - requires all onboarding
  creditcard: {
    requirement: 'all-onboarding',
    lockedMessage: 'Complete onboarding first',
    unlockHint: 'Complete all onboarding steps to manage credit cards.',
  },
  
  // Reward Management - requires all onboarding
  rewardmanagement: {
    requirement: 'all-onboarding',
    lockedMessage: 'Complete onboarding first',
    unlockHint: 'Complete all onboarding steps to access reward management.',
  },
  
  // Business Analytics - requires all onboarding
  businessanalytics: {
    requirement: 'all-onboarding',
    lockedMessage: 'Complete onboarding first',
    unlockHint: 'Complete all onboarding steps to view business analytics.',
  },
};

export function hasMetRequirement(
  requirement: AccessRequirement,
  user: AuthUser | null,
  permissions?: UserPermissions | null,
  permissionKey?: keyof UserPermissions
): boolean {
  if (!user) return false;

  switch (requirement) {
    case 'none':
      return true;

    case 'payment-method':
      return user.hasAddedVendor === true && user.hasAddedPaymentMethod === true;

    case 'vendor':
      return user.hasAddedVendor === true;

    case 'first-payment':
      return user.hasCreatedFirstPayment === true;

    case 'all-onboarding':
      return (
        user.hasAddedPaymentMethod === true &&
        user.hasAddedVendor === true &&
        user.hasCreatedFirstPayment === true
      );

    case 'permission-based':
      // Check if user has the required permission
      if (!permissions || !permissionKey) return false;
      return permissions[permissionKey] === true;

    default:
      return false;
  }
}

export function isMenuItemAccessible(
  menuItemId: string,
  user: AuthUser | null,
  permissions?: UserPermissions | null
): boolean {
  const rule = navigationAccessRules[menuItemId];
  if (!rule) return true; // Default to accessible if no rule defined

  return hasMetRequirement(rule.requirement, user, permissions, rule.permissionKey);
}

export function getLockedMessage(menuItemId: string): string {
  return navigationAccessRules[menuItemId]?.lockedMessage || 'This feature is locked';
}

export function getUnlockHint(menuItemId: string): string {
  return navigationAccessRules[menuItemId]?.unlockHint || 'Complete the required steps to unlock this feature.';
}
