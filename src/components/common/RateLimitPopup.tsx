import { useState, useEffect } from 'react';
import { rateLimitManager, RateLimitError } from '@/lib/rateLimitManager';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle } from 'lucide-react';

export function RateLimitPopup() {
  const [currentError, setCurrentError] = useState<RateLimitError | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // Subscribe to rate limit manager
  useEffect(() => {
    const unsubscribe = rateLimitManager.subscribe((error) => {
      setCurrentError(error);
      if (error) {
        setRemainingTime(error.retryAfterSecs);
      }
    });

    return unsubscribe;
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!currentError || remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;
        // Auto-close when countdown reaches 0
        if (newTime <= 0) {
          handleClose();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentError, remainingTime]);

  const handleClose = () => {
    rateLimitManager.closeCurrentAndShowNext();
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const getMessage = (): string => {
    if (!currentError) return '';

    const { policyGroup, scope } = currentError;

    // User-friendly messages based on policy group
    const messages: Record<string, string> = {
      login: 'Too many login attempts. Please wait before trying again.',
      signup: 'Too many signup attempts. Please wait before trying again.',
      default: 'Too many requests. Please slow down and try again later.',
    };

    return messages[policyGroup] || messages.default;
  };

  const getDetailedInfo = (): string => {
    if (!currentError) return '';

    const { policyGroup, scope } = currentError;
    return `Rate limit applied: ${policyGroup} (${scope})`;
  };

  return (
    <AlertDialog open={!!currentError} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl">Slow Down!</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-base text-foreground mt-4">
            {getMessage()}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center justify-center py-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-2xl font-bold text-primary">
              <Clock className="h-6 w-6" />
              <span>{formatTime(remainingTime)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Time remaining</p>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          <p>{getDetailedInfo()}</p>
          {rateLimitManager.getQueueLength() > 0 && (
            <p className="mt-2 text-xs">
              ({rateLimitManager.getQueueLength()} more notification
              {rateLimitManager.getQueueLength() !== 1 ? 's' : ''} pending)
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <Button onClick={handleClose} variant="default" className="w-full">
            I Understand
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
