/**
 * Utility functions for handling popup windows
 */

/**
 * Opens a popup window and checks if it was blocked
 * @param url - The URL to open in the popup
 * @param name - The name of the popup window
 * @param features - Window features (width, height, etc.)
 * @returns The popup window object if successful, null if blocked
 */
export const openPopup = (
  url: string,
  name: string = '_blank',
  features: string = 'width=800,height=600,scrollbars=yes'
): Window | null => {
  const popup = window.open(url, name, features);

  // Check if popup was blocked
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    console.warn('Popup was blocked by browser');
    return null;
  }

  return popup;
};

/**
 * Monitors a popup window and calls a callback when it closes
 * @param popup - The popup window to monitor
 * @param onClose - Callback function to execute when popup closes
 * @param interval - Check interval in milliseconds (default: 500ms)
 * @returns Function to stop monitoring
 */
export const monitorPopupClosure = (
  popup: Window,
  onClose: () => void,
  interval: number = 500
): (() => void) => {
  const checkInterval = setInterval(() => {
    if (popup.closed) {
      clearInterval(checkInterval);
      onClose();
    }
  }, interval);

  // Return cleanup function
  return () => clearInterval(checkInterval);
};

/**
 * Opens a popup and monitors its closure
 * @param url - The URL to open
 * @param name - Window name
 * @param features - Window features
 * @param onClose - Callback when popup closes
 * @param onBlocked - Callback if popup is blocked
 * @returns Cleanup function to stop monitoring
 */
export const openAndMonitorPopup = (
  url: string,
  name: string = '_blank',
  features: string = 'width=800,height=600,scrollbars=yes',
  onClose: () => void,
  onBlocked?: () => void
): (() => void) | null => {
  const popup = openPopup(url, name, features);

  if (!popup) {
    onBlocked?.();
    return null;
  }

  return monitorPopupClosure(popup, onClose);
};
