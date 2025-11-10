import { useBusiness } from '@/contexts/BusinessContext';
import { UserPermissions } from '@/types/permissions';
import { hasPermission as checkPermission } from '@/lib/permissions';

/**
 * Hook to access user permissions for the current business
 *
 * Usage:
 * ```
 * const { permissions, hasPermission } = usePermissions();
 *
 * if (hasPermission('canPayBills')) {
 *   // Show pay button
 * }
 * ```
 */
export const usePermissions = () => {
  const { selectedBusiness } = useBusiness();

  const permissions = selectedBusiness?.permissions || null;

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return checkPermission(permissions, permission);
  };

  /**
   * Check if user has ANY of the specified permissions
   */
  const hasAnyPermission = (...permissionsToCheck: (keyof UserPermissions)[]): boolean => {
    return permissionsToCheck.some(p => checkPermission(permissions, p));
  };

  /**
   * Check if user has ALL of the specified permissions
   */
  const hasAllPermissions = (...permissionsToCheck: (keyof UserPermissions)[]): boolean => {
    return permissionsToCheck.every(p => checkPermission(permissions, p));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole: selectedBusiness?.userRole,
  };
};
