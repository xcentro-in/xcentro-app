
export type UserRole = 'owner' | 'admin' | 'finance_manager' | 'accountant' | 'basic_user';

export type UserStatus = 'active' | 'pending' | 'revoked';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  status: UserStatus;
  lastActive?: string;
  dateAdded: string;
}

export interface UserInvite {
  id: string;
  email: string;
  role: UserRole;
  department?: string;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
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
  finance_manager: [
    'View all financial data',
    'Manage payment methods',
    'Create and approve transactions',
    'Access financial reports',
    'Limited settings access'
  ],
  accountant: [
    'View financial data',
    'Create transactions',
    'Request transaction approvals',
    'Access basic reports',
    'No settings access'
  ],
  basic_user: [
    'View assigned transactions',
    'Create transaction requests',
    'View basic financial data',
    'No approvals or settings access'
  ]
};

export const userRoleLabels: Record<UserRole, string> = {
  owner: 'Business Owner',
  admin: 'Administrator',
  finance_manager: 'Finance Manager',
  accountant: 'Accountant',
  basic_user: 'Basic User'
};
