import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to get the current business ID
 *
 * For fully onboarded users:
 * - Returns selectedBusiness.bid from BusinessContext (supports multi-business users)
 *
 * For users in onboarding:
 * - Returns activeBid from AuthContext
 * - Or null if no active business
 *
 * @returns businessId string or null
 */
export const useCurrentBusiness = (): { businessId: string | null; businessName: string | null } => {
  const { selectedBusiness } = useBusiness();
  const { activeBid, businesses } = useAuth();

  if (selectedBusiness) {
    return {
      businessId: selectedBusiness.bid,
      businessName: selectedBusiness.name,
    };
  }

  if (activeBid && businesses && businesses.length > 0) {
    const activeBusiness = businesses.find(b => b.bid === activeBid);
    return {
      businessId: activeBid,
      businessName: activeBusiness?.name || null,
    };
  }

  return {
    businessId: null,
    businessName: null,
  };
};
