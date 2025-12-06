import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to get the current business ID
 *
 * For fully onboarded users:
 * - Returns selectedBusiness.bid from BusinessContext (supports multi-business users)
 *
 * For users in onboarding:
 * - Returns userRoles[0].businessId (first/primary role)
 * - Or null if no roles yet
 *
 * @returns businessId string or null
 */
export const useCurrentBusiness = (): { businessId: string | null; businessName: string | null } => {
  const { selectedBusiness } = useBusiness();
  const { userRoles } = useAuth();

  // Prefer selectedBusiness from BusinessContext (fully onboarded users)
  if (selectedBusiness) {
    return {
      businessId: selectedBusiness.bid,
      businessName: selectedBusiness.name,
    };
  }

  // Fallback to primary role from userRoles (during/after onboarding, before BusinessContext loads)
  if (userRoles && userRoles.length > 0) {
    return {
      businessId: userRoles[0].businessId,
      businessName: null, // Name not available from roles alone
    };
  }

  // No business context available
  return {
    businessId: null,
    businessName: null,
  };
};
