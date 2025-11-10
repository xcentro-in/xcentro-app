// Permission types for role-based access control (RBAC)

export type BusinessRole = 'owner' | 'admin' | 'accountant' | 'viewer';

export interface UserPermissions {
  // Can execute payment transactions
  canPayBills: boolean;

  // Can request approval from owner/approvers
  canRequestApproval: boolean;

  // Can approve/reject payment requests from others
  canApprovePayments: boolean;

  // Can view the approvals inbox page
  canViewApprovals: boolean;

  // Whether this user needs approval before paying (true for non-owner users with pay permission)
  needsApproval: boolean;
}

export interface PermissionsResponse {
  permissions: UserPermissions;
  role: BusinessRole;
}
