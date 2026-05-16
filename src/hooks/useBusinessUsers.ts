import { useState, useEffect } from 'react';
import { businessAPI } from '@/services/api';
import { User, UserInvite } from '@/types/user';
import { isStatusComplete } from '@/constants/onboarding';

interface UseBusinessUsersReturn {
  activeUsers: User[];
  pendingInvites: UserInvite[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useBusinessUsers(businessId: string | undefined): UseBusinessUsersReturn {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [pendingInvites, setPendingInvites] = useState<UserInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await businessAPI.getUsers();
      const users = response.data;

      // Active = kyc_completed or kyc_verified; anything else = pending
      const active: User[] = [];
      const pending: UserInvite[] = [];

      users.forEach((user) => {
        if (!isStatusComplete(user.kycStatus)) {
          pending.push({
            id: user.userId,
            email: user.email,
            name: user.name,
            role: user.role as any,
            addedAt: user.addedAt,
            kycNeeded: true,
          });
        } else {
          active.push({
            id: user.userId,
            email: user.email,
            name: user.name,
            role: user.role as any,
            status: 'active',
            addedAt: user.addedAt,
            kycNeeded: false,
          });
        }
      });

      setActiveUsers(active);
      setPendingInvites(pending);
    } catch (err: any) {
      console.error('Failed to fetch business users:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [businessId]);

  return {
    activeUsers,
    pendingInvites,
    isLoading,
    error,
    refetch: fetchUsers,
  };
}
