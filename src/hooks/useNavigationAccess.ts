import { useAuth } from "@/contexts/AuthContext";
import { 
  isMenuItemAccessible, 
  getLockedMessage, 
  getUnlockHint 
} from "@/config/navigationAccessControl";

export interface NavigationAccessStatus {
  isAccessible: boolean;
  lockedMessage: string;
  unlockHint: string;
  hasAddedPaymentMethod: boolean;
  hasAddedVendor: boolean;
  hasCreatedFirstPayment: boolean;
}

export function useNavigationAccess(menuItemId: string): NavigationAccessStatus {
  const { user } = useAuth();
  
  const isAccessible = isMenuItemAccessible(menuItemId, user);
  const lockedMessage = getLockedMessage(menuItemId);
  const unlockHint = getUnlockHint(menuItemId);
  
  return {
    isAccessible,
    lockedMessage,
    unlockHint,
    hasAddedPaymentMethod: user?.hasAddedPaymentMethod ?? false,
    hasAddedVendor: user?.hasAddedVendor ?? false,
    hasCreatedFirstPayment: user?.hasCreatedFirstPayment ?? false,
  };
}
