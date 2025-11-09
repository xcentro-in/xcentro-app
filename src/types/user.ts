
export type UserRole = 'owner' | 'admin' | 'manager' | 'auditor';

export type UserStatus = 'active' | 'pending' | 'revoked';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  status: UserStatus;
  addedAt: string;
  kycNeeded?: boolean;
}

export interface UserInvite {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  addedAt: string;
  kycNeeded: boolean;
}

export const userRolePermissions: Record<UserRole, string[]> = {
  owner: [
    'Manage all users and roles',
    'Full access to all financial data',
    'Manage payment methods',
    'Approve all transactions',
    'Access financial reports',
    'Configure system settings'
  ],
  admin: [
    'Manage users (except owners)',
    'Full access to financial data',
    'Manage payment methods',
    'Approve transactions',
    'Access financial reports',
    'Configure most settings'
  ],
  manager: [
    'View all financial data',
    'Manage payment methods',
    'Create and approve transactions',
    'Access financial reports',
    'Limited settings access'
  ],
  auditor: [
    'View financial data',
    'Access all reports',
    'Review transactions',
    'No approval or modification rights',
    'Read-only access'
  ]
};

export const userRoleLabels: Record<UserRole, string> = {
  owner: 'Owner',
  admin: 'Administrator',
  manager: 'Manager',
  auditor: 'Auditor'
};
