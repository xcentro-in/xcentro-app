import { UserPermissions, BusinessRole } from '@/types/permissions';

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  permissions: UserPermissions | undefined | null,
  permission: keyof UserPermissions
): boolean {
  if (!permissions) return false;
  return permissions[permission] === true;
}

/**
 * Check if user can perform payment actions (pay or request approval)
 */
export function canInteractWithPayments(permissions: UserPermissions | undefined | null): boolean {
  if (!permissions) return false;
  return permissions.canPayBills || permissions.canRequestApproval;
}

/**
 * Check if user is an owner (has all permissions)
 */
export function isOwner(role: string | undefined): boolean {
  return role?.toLowerCase() === 'owner';
}

/**
 * Check if user needs approval before paying
 */
export function requiresApproval(permissions: UserPermissions | undefined | null): boolean {
  if (!permissions) return false;
  return permissions.needsApproval === true;
}

/**
 * Get permission description for debugging/logging
 */
export function getPermissionSummary(permissions: UserPermissions): string {
  const granted: string[] = [];

  if (permissions.canPayBills) granted.push('pay');
  if (permissions.canRequestApproval) granted.push('request approval');
  if (permissions.canApprovePayments) granted.push('approve');
  if (permissions.canViewApprovals) granted.push('view approvals');

  return granted.length > 0 ? granted.join(', ') : 'no permissions';
}
