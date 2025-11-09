import { useState, useEffect } from 'react';
import { businessAPI } from '@/services/api';
import { User, UserInvite } from '@/types/user';

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

      const response = await businessAPI.getUsers(businessId);
      const users = response.data;

      // Filter users based on kycNeeded
      const active: User[] = [];
      const pending: UserInvite[] = [];

      users.forEach((user) => {
        if (user.kycNeeded) {
          // User needs KYC - goes to pending invites
          pending.push({
            id: user.userId,
            email: user.email,
            name: user.name,
            role: user.role as any, // Backend returns lowercase, type will handle it
            addedAt: user.addedAt,
            kycNeeded: user.kycNeeded,
          });
        } else {
          // User is active
          active.push({
            id: user.userId,
            email: user.email,
            name: user.name,
            role: user.role as any,
            status: 'active', // All users with kycNeeded: false are active
            addedAt: user.addedAt,
            kycNeeded: user.kycNeeded,
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
