import { UserPermissions, BusinessRole } from '@/types/permissions';

/**
 * Mock permission rules based on business role
 * This will be replaced with actual API call when backend is ready
 *
 * MVP Rules:
 * - Owner: Full access, can pay without approval, can approve others, sees Approvals page
 * - Admin: Can pay but needs approval, can request approval, cannot approve
 * - Accountant: Can pay but needs approval, can request approval, cannot approve
 * - Viewer: Read-only, no payment permissions
 *
 * TODO: Replace with API call to GET /v1/users/permissions
 */
export const getMockPermissions = (role: string): UserPermissions => {
  const normalizedRole = role?.toLowerCase() as BusinessRole;

  switch (normalizedRole) {
    case 'owner':
      return {
        canPayBills: true,
        canRequestApproval: false, // Owner doesn't need to request approval
        canApprovePayments: true,
        canViewApprovals: true,
        needsApproval: false
      };

    case 'admin':
      // Admin has pay permission but needs owner approval
      return {
        canPayBills: true,
        canRequestApproval: true,
        canApprovePayments: false,
        canViewApprovals: false,
        needsApproval: true
      };

    case 'accountant':
      // Accountant has pay permission but needs owner approval
      return {
        canPayBills: true,
        canRequestApproval: true,
        canApprovePayments: false,
        canViewApprovals: false,
        needsApproval: true
      };

    case 'viewer':
      // Viewer has read-only access
      return {
        canPayBills: false,
        canRequestApproval: false,
        canApprovePayments: false,
        canViewApprovals: false,
        needsApproval: false
      };

    default:
      // Default: no permissions (safest fallback)
      console.warn(`Unknown role: ${role}, defaulting to no permissions`);
      return {
        canPayBills: false,
        canRequestApproval: false,
        canApprovePayments: false,
        canViewApprovals: false,
        needsApproval: false
      };
  }
};

/**
 * Mock API response structure
 */
export const getMockPermissionsResponse = (role: string) => {
  return {
    permissions: getMockPermissions(role),
    role: role.toLowerCase() as BusinessRole
  };
};
