import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { UserPermissions } from '@/types/permissions';

interface PermissionGuardProps {
  /**
   * The permission key to check
   */
  permission: keyof UserPermissions;

  /**
   * Content to render if user has permission
   */
  children: ReactNode;

  /**
   * Optional fallback content to render if user doesn't have permission
   */
  fallback?: ReactNode;

  /**
   * Optional custom check function for more complex permission logic
   */
  customCheck?: (permissions: UserPermissions | null) => boolean;
}

/**
 * Component that conditionally renders children based on user permissions
 *
 * Usage:
 * ```tsx
 * <PermissionGuard permission="canPayBills">
 *   <Button>Pay Now</Button>
 * </PermissionGuard>
 *
 * <PermissionGuard
 *   permission="canViewApprovals"
 *   fallback={<p>Access denied</p>}
 * >
 *   <ApprovalsList />
 * </PermissionGuard>
 * ```
 */
export const PermissionGuard = ({
  permission,
  children,
  fallback = null,
  customCheck,
}: PermissionGuardProps) => {
  const { permissions, hasPermission } = usePermissions();

  // Use custom check if provided, otherwise use default permission check
  const hasAccess = customCheck
    ? customCheck(permissions)
    : hasPermission(permission);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

/**
 * Hook-based version for conditional rendering in component logic
 *
 * Usage:
 * ```tsx
 * const canPay = useHasPermission('canPayBills');
 * if (!canPay) return null;
 * ```
 */
export const useHasPermission = (permission: keyof UserPermissions): boolean => {
  const { hasPermission } = usePermissions();
  return hasPermission(permission);
};
