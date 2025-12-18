/**
 * Cloudflare Turnstile Type Definitions
 *
 * TypeScript interfaces for Cloudflare Turnstile invisible widget
 * Documentation: https://developers.cloudflare.com/turnstile/
 */

/**
 * Turnstile API interface exposed on window.turnstile
 */
export interface TurnstileAPI {
  /**
   * Register callback to execute when Turnstile is ready
   */
  ready(callback: () => void): void;

  /**
   * Render a Turnstile widget
   * @param container - DOM element or selector string
   * @param options - Widget configuration options
   * @returns Widget ID for future operations
   */
  render(
    container: string | HTMLElement,
    options: TurnstileRenderOptions
  ): string;

  /**
   * Reset a widget to allow re-challenge
   * @param widgetId - ID returned from render()
   */
  reset(widgetId: string): void;

  /**
   * Remove a widget from the DOM
   * @param widgetId - ID returned from render()
   */
  remove(widgetId: string): void;

  /**
   * Execute a challenge programmatically (for execution='execute' mode)
   * @param widgetId - ID returned from render()
   * @param options - Execution options with callbacks
   */
  execute(widgetId: string, options?: TurnstileExecuteOptions): void;

  /**
   * Get the current response token from a widget
   * @param widgetId - ID returned from render()
   * @returns Token string or empty string if not ready
   */
  getResponse(widgetId: string): string;
}

/**
 * Options for rendering a Turnstile widget
 */
export interface TurnstileRenderOptions {
  /**
   * Site key from Cloudflare dashboard
   */
  sitekey: string;

  /**
   * Widget theme
   * @default 'auto'
   */
  theme?: 'light' | 'dark' | 'auto';

  /**
   * Widget size
   * - 'normal': Standard widget size (~300x65px)
   * - 'compact': Smaller widget size (~150x140px)
   * - 'flexible': Responsive sizing
   * @default 'normal'
   */
  size?: 'normal' | 'compact' | 'flexible';

  /**
   * Execution mode
   * - 'render': Execute challenge immediately on render
   * - 'execute': Wait for explicit execute() call (programmatic control)
   * @default 'render'
   */
  execution?: 'render' | 'execute';

  /**
   * Appearance mode - controls when the widget is visible
   * - 'always': Widget always visible (default)
   * - 'execute': Widget appears only during execution
   * - 'interaction-only': Widget appears only when interaction needed
   * @default 'always'
   */
  appearance?: 'always' | 'execute' | 'interaction-only';

  /**
   * Callback when token is successfully generated
   */
  callback?: (token: string) => void;

  /**
   * Callback when challenge expires (token becomes invalid)
   */
  'expired-callback'?: () => void;

  /**
   * Callback when challenge encounters an error
   */
  'error-callback'?: (error: string) => void;

  /**
   * Language code for widget UI
   * @default 'auto' (browser language)
   */
  language?: string;

  /**
   * Tab index for accessibility
   */
  tabindex?: number;

  /**
   * Response field name (for form integration)
   */
  'response-field'?: boolean;

  /**
   * Response field name override
   */
  'response-field-name'?: string;
}

/**
 * Options for execute() method
 */
export interface TurnstileExecuteOptions {
  /**
   * Callback when token is successfully generated
   */
  callback?: (token: string) => void;

  /**
   * Callback when challenge expires
   */
  'expired-callback'?: () => void;

  /**
   * Callback when challenge encounters an error
   */
  'error-callback'?: (error: string) => void;
}

/**
 * Turnstile manager configuration
 */
export interface TurnstileConfig {
  /**
   * Site key from environment variable
   */
  siteKey: string;

  /**
   * Whether Turnstile is enabled (production + has site key)
   */
  enabled: boolean;
}

/**
 * Internal widget tracking structure
 */
export interface TurnstileWidget {
  /**
   * Widget ID returned by turnstile.render()
   */
  id: string;

  /**
   * DOM container element
   */
  container: HTMLElement;

  /**
   * Timestamp when widget was created
   */
  createdAt: number;
}

/**
 * Augment global Window interface with Turnstile API
 */
declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}

export {};
