import { useState } from 'react';
import { Building, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Blocking modal shown when a user belongs to 2+ businesses and hasn't confirmed their active one.
 * Disappears automatically once needsBusinessSelection becomes false after switchBusiness completes.
 */
const BusinessSelectorModal = () => {
  const { businesses, activeBid, switchBusiness } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);
  const [pendingBid, setPendingBid] = useState<string | null>(null);

  const handleSelect = async (bid: string) => {
    if (isSwitching) return;
    setIsSwitching(true);
    setPendingBid(bid);
    try {
      await switchBusiness(bid);
      // needsBusinessSelection becomes false → ProtectedRoute re-renders → modal removed
    } catch {
      setIsSwitching(false);
      setPendingBid(null);
    }
  };

  return (
    <Dialog open modal>
      <DialogContent
        className="sm:max-w-md"
        // Prevent closing by clicking outside or pressing Escape
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Select a Business</DialogTitle>
          <DialogDescription>
            You have access to multiple businesses. Choose which one to work with.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-2">
          {businesses.map(business => {
            const isActive = business.bid === activeBid;
            const isBeingSwitched = pendingBid === business.bid && isSwitching;

            return (
              <Button
                key={business.bid}
                variant="outline"
                className={cn(
                  'flex items-center justify-between h-auto px-4 py-3 text-left',
                  isActive && 'border-primary bg-primary/5'
                )}
                onClick={() => handleSelect(business.bid)}
                disabled={isSwitching}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 shrink-0">
                    {isBeingSwitched
                      ? <Loader2 className="h-4 w-4 text-primary animate-spin" />
                      : <Building className="h-4 w-4 text-primary" />
                    }
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-sm">{business.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{business.role}</span>
                  </div>
                </div>
                {isActive && !isSwitching && (
                  <Check className="h-4 w-4 text-primary shrink-0" />
                )}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessSelectorModal;
