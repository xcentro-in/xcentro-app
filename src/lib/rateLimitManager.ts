/**
 * Rate Limit Manager
 *
 * Manages rate limit popups to ensure only one is shown at a time.
 * Queues multiple rate limit errors and shows them sequentially.
 */

export interface RateLimitError {
  retryAfterSecs: number;
  scope: string;
  policyGroup: string;
  timestamp: number;
}

type RateLimitCallback = (error: RateLimitError | null) => void;

class RateLimitManager {
  private queue: RateLimitError[] = [];
  private currentError: RateLimitError | null = null;
  private isShowing: boolean = false;
  private listeners: Set<RateLimitCallback> = new Set();

  /**
   * Add a rate limit error to the queue
   */
  addError(error: Omit<RateLimitError, 'timestamp'>): void {
    const newError: RateLimitError = {
      ...error,
      timestamp: Date.now(),
    };

    // Check if we already have a similar error in queue (within last 5 seconds)
    const isDuplicate = this.queue.some(
      (existing) =>
        existing.scope === newError.scope &&
        existing.policyGroup === newError.policyGroup &&
        Math.abs(existing.timestamp - newError.timestamp) < 5000
    );

    if (isDuplicate) {
      console.log('[RateLimitManager] Duplicate error ignored:', newError);
      return;
    }

    // Add to queue
    this.queue.push(newError);
    console.log('[RateLimitManager] Error added to queue. Queue length:', this.queue.length);

    // Show if not currently showing
    if (!this.isShowing) {
      this.showNext();
    }
  }

  /**
   * Show the next error in queue
   */
  private showNext(): void {
    if (this.queue.length === 0) {
      this.isShowing = false;
      this.currentError = null;
      this.notifyListeners(null);
      return;
    }

    this.isShowing = true;
    this.currentError = this.queue.shift() || null;
    console.log('[RateLimitManager] Showing error:', this.currentError);
    this.notifyListeners(this.currentError);
  }

  /**
   * Close the current popup and show next if available
   */
  closeCurrentAndShowNext(): void {
    console.log('[RateLimitManager] Closing current popup. Remaining in queue:', this.queue.length);
    this.showNext();
  }

  /**
   * Subscribe to rate limit popup changes
   */
  subscribe(callback: RateLimitCallback): () => void {
    this.listeners.add(callback);

    // Immediately call with current state if showing
    if (this.isShowing && this.currentError) {
      callback(this.currentError);
    }

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of current state
   */
  private notifyListeners(error: RateLimitError | null): void {
    this.listeners.forEach((callback) => callback(error));
  }

  /**
   * Get current error being displayed
   */
  getCurrentError(): RateLimitError | null {
    return this.currentError;
  }

  /**
   * Check if a popup is currently showing
   */
  isCurrentlyShowing(): boolean {
    return this.isShowing;
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Clear all errors (useful for logout or navigation)
   */
  clearAll(): void {
    this.queue = [];
    this.currentError = null;
    this.isShowing = false;
    this.notifyListeners(null);
  }
}

// Export singleton instance
export const rateLimitManager = new RateLimitManager();
