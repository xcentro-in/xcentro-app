/**
 * Cloudflare Turnstile Manager
 *
 * Singleton class managing invisible Turnstile widget lifecycle and token generation.
 *
 * Features:
 * - Automatic widget initialization on first use
 * - Token caching (4-minute reuse to avoid unnecessary challenges)
 * - Promise caching to prevent simultaneous executions
 * - Production-only (disabled when VITE_TURNSTILE_SITE_KEY not set)
 * - Automatic cleanup on logout
 *
 * Usage:
 * ```typescript
 * import { turnstileManager } from '@/services/turnstileManager';
 *
 * if (turnstileManager.isEnabled()) {
 *   const token = await turnstileManager.getToken();
 *   // Use token in API request header
 * }
 * ```
 */

import type { TurnstileConfig, TurnstileWidget } from '@/types/turnstile';

// Token caching constants
const TOKEN_CACHE_DURATION = 240000; // 4 minutes (240 seconds)
const TOKEN_EXPIRATION = 300000; // 5 minutes (Cloudflare enforced)
const SAFETY_MARGIN = 60000; // 1 minute buffer before expiration
const TOKEN_GENERATION_TIMEOUT = 30000; // 30 seconds max for token generation

class TurnstileManager {
  private static instance: TurnstileManager;
  private config: TurnstileConfig;
  private widget: TurnstileWidget | null = null;
  private isScriptLoaded: boolean = false;
  private scriptLoadPromise: Promise<void> | null = null;
  private tokenPromises: Map<string, Promise<string>> = new Map();

  private constructor() {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
    const isProduction = import.meta.env.PROD;

    this.config = {
      siteKey,
      enabled: !!siteKey,
    };

    // Log initialization status
    if (this.config.enabled) {
      console.log('[Turnstile] Enabled in production mode');
    // } else if (import.meta.env.DEV) {
    //   console.log('[Turnstile] Disabled in development mode');
    } else {
      console.warn('[Turnstile] Site key not configured - protection disabled');
    }
  }

  /**
   * Get singleton instance
   */
  static getInstance(): TurnstileManager {
    if (!TurnstileManager.instance) {
      TurnstileManager.instance = new TurnstileManager();
    }
    return TurnstileManager.instance;
  }

  /**
   * Check if Turnstile is enabled
   * Returns false in development or when site key not configured
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Generate Turnstile token with caching
   *
   * This is the main public API for getting tokens.
   * - Reuses cached tokens (< 4 minutes old)
   * - Prevents simultaneous executions via promise caching
   * - Throws error if token generation fails
   *
   * @returns Promise resolving to Turnstile token string
   * @throws Error if Turnstile not enabled or token generation fails
   */
  async getToken(): Promise<string> {
    if (!this.config.enabled) {
      throw new Error('[Turnstile] Not enabled - check VITE_TURNSTILE_SITE_KEY');
    }

    // Check for in-progress token generation
    const existingPromise = this.tokenPromises.get('current');
    if (existingPromise) {
      console.log('[Turnstile] Waiting for in-progress token generation');
      return existingPromise;
    }

    // Start new token generation
    const tokenPromise = this._generateToken();
    this.tokenPromises.set('current', tokenPromise);

    try {
      const token = await tokenPromise;
      return token;
    } finally {
      // Clean up promise cache
      this.tokenPromises.delete('current');
    }
  }

  /**
   * Internal token generation with caching and execution
   *
   * Flow:
   * 1. Check cached token (< 4 minutes old)
   * 2. If cache miss, ensure script loaded
   * 3. Ensure widget initialized
   * 4. Execute challenge to get new token
   * 5. Cache token for reuse
   *
   * @private
   */
  private async _generateToken(): Promise<string> {
    // Ensure Cloudflare script is loaded
    await this.ensureScriptLoaded();

    // Ensure widget is initialized
    await this.ensureWidgetInitialized();

    // Check cached token (< 4 minutes old)
    if (this.widget?.lastToken && this.widget.lastTokenTimestamp) {
      const age = Date.now() - this.widget.lastTokenTimestamp;
      if (age < TOKEN_CACHE_DURATION) {
        console.log(`[Turnstile] Using cached token (age: ${Math.round(age / 1000)}s)`);
        return this.widget.lastToken;
      } else {
        console.log(`[Turnstile] Cached token expired (age: ${Math.round(age / 1000)}s), generating new token`);
      }
    }

    // Generate new token via challenge execution
    console.log('[Turnstile] Generating new token...');
    return new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        const error = new Error(`[Turnstile] Token generation timeout (${TOKEN_GENERATION_TIMEOUT / 1000}s)`);
        console.error(error.message);
        reject(error);
      }, TOKEN_GENERATION_TIMEOUT);

      try {
        // Reset widget before execution (clears any previous state)
        if (this.widget?.id && window.turnstile) {
          window.turnstile.reset(this.widget.id);
        }

        // Execute challenge
        window.turnstile!.execute(this.widget!.id, {
          callback: (token: string) => {
            clearTimeout(timeout);

            // Cache token with timestamp
            if (this.widget) {
              this.widget.lastToken = token;
              this.widget.lastTokenTimestamp = Date.now();
            }

            console.log('[Turnstile] Token generated successfully');
            resolve(token);
          },
          'error-callback': (error: string) => {
            clearTimeout(timeout);
            console.error('[Turnstile] Challenge error:', error);

            const challengeError = new Error(`[Turnstile] Challenge failed: ${error}`);
            reject(challengeError);
          },
        });
      } catch (error) {
        clearTimeout(timeout);
        console.error('[Turnstile] Execution error:', error);
        reject(error);
      }
    });
  }

  /**
   * Ensure Cloudflare script is loaded
   *
   * Waits for window.turnstile to become available.
   * Script is loaded via <script> tag in index.html.
   *
   * @private
   */
  private async ensureScriptLoaded(): Promise<void> {
    // Already loaded
    if (this.isScriptLoaded && window.turnstile) {
      return;
    }

    // Wait for in-progress load
    if (this.scriptLoadPromise) {
      return this.scriptLoadPromise;
    }

    // Start new load wait
    this.scriptLoadPromise = new Promise((resolve, reject) => {
      // Check if already available
      if (window.turnstile) {
        window.turnstile.ready(() => {
          this.isScriptLoaded = true;
          console.log('[Turnstile] Script already loaded');
          resolve();
        });
        return;
      }

      // Poll for script availability
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds (100 * 100ms)
      const checkInterval = setInterval(() => {
        attempts++;

        if (window.turnstile) {
          clearInterval(checkInterval);
          window.turnstile.ready(() => {
            this.isScriptLoaded = true;
            console.log('[Turnstile] Script loaded successfully');
            resolve();
          });
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          const error = new Error(
            '[Turnstile] Script load timeout - ensure script tag is in index.html'
          );
          console.error(error.message);
          reject(error);
        }
      }, 100);
    });

    return this.scriptLoadPromise;
  }

  /**
   * Ensure widget is initialized in DOM
   *
   * Creates invisible widget container and renders Turnstile widget.
   * Widget stays in DOM for entire session (better performance).
   *
   * @private
   */
  private async ensureWidgetInitialized(): Promise<void> {
    // Widget already exists and is in DOM
    if (this.widget?.id && document.getElementById(this.widget.container.id)) {
      return;
    }

    // Create or reuse container
    let container = document.getElementById('turnstile-widget') as HTMLElement;
    if (!container) {
      container = document.createElement('div');
      container.id = 'turnstile-widget';

      // Position off-screen (invisible widget has no UI anyway)
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-1';

      document.body.appendChild(container);
      console.log('[Turnstile] Widget container created');
    }

    // Render widget with programmatic execution
    const widgetId = window.turnstile!.render(container, {
      sitekey: this.config.siteKey,
      theme: 'light',
      size: 'invisible', // No visible UI
      execution: 'execute', // Programmatic control (call execute() manually)
    });

    // Store widget reference
    this.widget = {
      id: widgetId,
      container,
      createdAt: Date.now(),
      lastToken: null,
      lastTokenTimestamp: null,
    };

    console.log('[Turnstile] Widget initialized:', widgetId);
  }

  /**
   * Reset widget state
   *
   * Call this after a verification failure to allow retry.
   * Clears cached token and resets widget state.
   */
  reset(): void {
    if (!this.widget) {
      return;
    }

    // Clear cached token
    this.widget.lastToken = null;
    this.widget.lastTokenTimestamp = null;

    // Reset widget if API available
    if (window.turnstile) {
      window.turnstile.reset(this.widget.id);
      console.log('[Turnstile] Widget reset');
    }
  }

  /**
   * Cleanup widget and remove from DOM
   *
   * Call this on logout or when Turnstile is no longer needed.
   * Clears all cached state and removes widget from page.
   */
  cleanup(): void {
    if (!this.widget) {
      return;
    }

    // Remove via Turnstile API
    if (window.turnstile) {
      try {
        window.turnstile.remove(this.widget.id);
        console.log('[Turnstile] Widget removed via API');
      } catch (error) {
        console.warn('[Turnstile] Error removing widget:', error);
      }
    }

    // Remove container from DOM
    if (this.widget.container.parentNode) {
      this.widget.container.parentNode.removeChild(this.widget.container);
      console.log('[Turnstile] Container removed from DOM');
    }

    // Clear widget reference
    this.widget = null;

    // Clear promise caches
    this.tokenPromises.clear();
  }

  /**
   * Get widget info for debugging
   */
  getDebugInfo(): object {
    return {
      enabled: this.config.enabled,
      siteKeyConfigured: !!this.config.siteKey,
      scriptLoaded: this.isScriptLoaded,
      widgetInitialized: !!this.widget,
      widgetId: this.widget?.id,
      hasCachedToken: !!this.widget?.lastToken,
      cachedTokenAge: this.widget?.lastTokenTimestamp
        ? Math.round((Date.now() - this.widget.lastTokenTimestamp) / 1000)
        : null,
    };
  }
}

// Export singleton instance
export const turnstileManager = TurnstileManager.getInstance();
