/**
 * Centralized Onboarding Constants
 *
 * Single source of truth for all onboarding status values and validation helpers.
 * Used across BusinessOnboarding, UserOnboarding, AuthContext, and routing logic.
 */

// Onboarding status values — matches backend exactly (used for both KYB and KYC)
export const ONBOARDING_STATUS = {
  NOT_STARTED:  'kyc_not_started',
  IN_PROGRESS:  'kyc_in_progress',
  COMPLETED:    'kyc_completed',
  VERIFIED:     'kyc_verified',
  NEEDS_UPDATE: 'kyc_needs_update',
  REJECTED:     'kyc_rejected',
} as const;

// Statuses that mean onboarding is done — allow routing to next step
const COMPLETED_STATUSES = [
  ONBOARDING_STATUS.COMPLETED,
  ONBOARDING_STATUS.VERIFIED,
] as const;

/**
 * Check if KYB (business) onboarding is complete
 */
export const isKybComplete = (status?: string): boolean => {
  return status ? COMPLETED_STATUSES.includes(status as any) : false;
};

/**
 * Check if KYC (user) onboarding is complete
 */
export const isKycComplete = (status?: string): boolean => {
  return status ? COMPLETED_STATUSES.includes(status as any) : false;
};

/**
 * Check if any onboarding status is complete
 */
export const isStatusComplete = (status?: string): boolean => {
  return status ? COMPLETED_STATUSES.includes(status as any) : false;
};

/**
 * Form field validation constants
 */
export const VALIDATION = {
  AADHAAR_LENGTH: 12,
  AADHAAR_PATTERN: /^\d{12}$/,
  PAN_LENGTH: 10,
  PAN_PATTERN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  CIN_LENGTH: 21,
} as const;

/**
 * Validate Aadhaar number
 */
export const validateAadhaar = (aadhaar: string): boolean => {
  const digits = aadhaar.replace(/-/g, '');
  return digits.length === VALIDATION.AADHAAR_LENGTH &&
         VALIDATION.AADHAAR_PATTERN.test(digits);
};

/**
 * Validate PAN number
 */
export const validatePAN = (pan: string): boolean => {
  return pan.length === VALIDATION.PAN_LENGTH &&
         VALIDATION.PAN_PATTERN.test(pan);
};

/**
 * Validate CIN number
 */
export const validateCIN = (cin: string): boolean => {
  return cin.length === VALIDATION.CIN_LENGTH;
};
