/**
 * Cloudflare Turnstile Manager
 *
 * Singleton class managing Turnstile widget lifecycle and token generation.
 *
 * Features:
 * - Automatic widget initialization on first use
 * - Fresh token generation for each API call (tokens are single-use)
 * - Promise caching to prevent simultaneous executions
 * - Production-only (disabled when VITE_TURNSTILE_SITE_KEY not set)
 * - Automatic cleanup on logout
 * - Managed mode: shows challenge only when Cloudflare detects risk
 *
 * Usage:
 * ```typescript
 * import { turnstileManager } from '@/services/turnstileManager';
 *
 * if (turnstileManager.isEnabled()) {
 *   const token = await turnstileManager.getToken();
 *   // Use token in API request header (single-use, valid for 5 minutes)
 * }
 * ```
 */

import type { TurnstileConfig, TurnstileWidget } from '@/types/turnstile';

// Token generation timeout
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
   * Show widget overlay and backdrop
   * @private
   */
  private showWidget(): void {
    const backdrop = document.getElementById('turnstile-backdrop');
    const container = this.widget?.container;

    if (backdrop) {
      backdrop.style.display = 'block';
    }

    if (container) {
      container.style.display = 'block';
    }

    console.log('[Turnstile] Widget overlay shown');
  }

  /**
   * Hide widget overlay and backdrop
   * @private
   */
  private hideWidget(): void {
    const backdrop = document.getElementById('turnstile-backdrop');
    const container = this.widget?.container;

    if (backdrop) {
      backdrop.style.display = 'none';
    }

    if (container) {
      container.style.display = 'none';
    }

    console.log('[Turnstile] Widget overlay hidden');
  }

  /**
   * Internal token generation with execution
   *
   * Note: Tokens are single-use and cannot be cached.
   * Each token can only be validated once by the backend.
   *
   * Flow:
   * 1. Ensure script loaded
   * 2. Ensure widget initialized
   * 3. Show widget overlay
   * 4. Execute challenge to get fresh token
   * 5. Hide widget overlay
   * 6. Return token (single-use, valid for 5 minutes)
   *
   * @private
   */
  private async _generateToken(): Promise<string> {
    // Ensure Cloudflare script is loaded
    await this.ensureScriptLoaded();

    // Ensure widget is initialized
    await this.ensureWidgetInitialized();

    // Show widget overlay (if Cloudflare shows challenge, user will see it)
    this.showWidget();

    // Generate fresh token via challenge execution
    // NOTE: Tokens are single-use - always generate fresh token for each API call
    console.log('[Turnstile] Generating fresh token...');
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

            console.log('[Turnstile] Token generated successfully');

            // Hide widget overlay
            this.hideWidget();

            resolve(token);
          },
          'error-callback': (error: string) => {
            clearTimeout(timeout);
            console.error('[Turnstile] Challenge error:', error);

            // Hide widget overlay
            this.hideWidget();

            const challengeError = new Error(`[Turnstile] Challenge failed: ${error}`);
            reject(challengeError);
          },
        });
      } catch (error) {
        clearTimeout(timeout);
        console.error('[Turnstile] Execution error:', error);

        // Hide widget overlay
        this.hideWidget();

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
   * Creates centered overlay widget container and renders Turnstile widget.
   * Widget stays in DOM for entire session (better performance).
   *
   * @private
   */
  private async ensureWidgetInitialized(): Promise<void> {
    // Widget already exists and is in DOM
    if (this.widget?.id && document.getElementById(this.widget.container.id)) {
      return;
    }

    // Create backdrop
    let backdrop = document.getElementById('turnstile-backdrop') as HTMLElement;
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'turnstile-backdrop';
      backdrop.style.position = 'fixed';
      backdrop.style.top = '0';
      backdrop.style.left = '0';
      backdrop.style.width = '100%';
      backdrop.style.height = '100%';
      backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      backdrop.style.zIndex = '9998';
      backdrop.style.display = 'none';
      document.body.appendChild(backdrop);
    }

    // Create or reuse container
    let container = document.getElementById('turnstile-widget') as HTMLElement;
    if (!container) {
      container = document.createElement('div');
      container.id = 'turnstile-widget';

      // Center overlay positioning
      container.style.position = 'fixed';
      container.style.top = '50%';
      container.style.left = '50%';
      container.style.transform = 'translate(-50%, -50%)';
      container.style.zIndex = '9999';
      container.style.padding = '24px';
      container.style.background = 'white';
      container.style.borderRadius = '12px';
      container.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
      container.style.display = 'none'; // Hidden by default

      document.body.appendChild(container);
      console.log('[Turnstile] Widget container created');
    }

    // Render widget with programmatic execution
    const widgetId = window.turnstile!.render(container, {
      sitekey: this.config.siteKey,
      theme: 'light',
      size: 'compact', // Compact widget size (150x140px)
      appearance: 'execute', // Widget appears during execution
      execution: 'execute', // Programmatic control (call execute() manually)
    });

    // Store widget reference
    this.widget = {
      id: widgetId,
      container,
      createdAt: Date.now(),
    };

    console.log('[Turnstile] Widget initialized:', widgetId);
  }

  /**
   * Reset widget state
   *
   * Call this after a verification failure to allow retry.
   * Resets widget state for next token generation.
   */
  reset(): void {
    if (!this.widget) {
      return;
    }

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
    };
  }
}

// Export singleton instance
export const turnstileManager = TurnstileManager.getInstance();
