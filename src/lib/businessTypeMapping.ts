/**
 * Business Type Mapping Utilities
 * Maps between frontend display values and backend API values
 */

// Frontend to Backend mapping
export const businessTypeToBackend: Record<string, string> = {
  "Sole Proprietorship": "sole_proprietorship",
  "Partnership": "partnership",
  "Limited Liability Partnership (LLP)": "limited_liability_partnership",
  "Private Limited Company": "private_limited_company",
  "One Person Company (OPC)": "one_person_company",
  "Section 8 (Non-Profit)": "section_8_non_profit",
  "Trust": "trust",
  "NGO": "ngo",
  "Society": "society",
  "Cooperative Society": "cooperative_society",
  "Other": "other"
};

// Backend to Frontend mapping (reverse)
export const businessTypeToFrontend: Record<string, string> = {
  "sole_proprietorship": "Sole Proprietorship",
  "partnership": "Partnership",
  "limited_liability_partnership": "Limited Liability Partnership (LLP)",
  "private_limited_company": "Private Limited Company",
  "one_person_company": "One Person Company (OPC)",
  "section_8_non_profit": "Section 8 (Non-Profit)",
  "trust": "Trust",
  "ngo": "NGO",
  "society": "Society",
  "cooperative_society": "Cooperative Society",
  "other": "Other"
};

// Business types that require CIN
export const businessTypesRequiringCIN = new Set([
  "private_limited_company",
  "one_person_company",
  "limited_liability_partnership",
  "section_8_non_profit"
]);

// Business types that require deed upload
export const businessTypesRequiringDeed = new Set([
  "partnership",
  "limited_liability_partnership",
  "trust",
  "ngo",
  "society",
  "cooperative_society"
]);

/**
 * Convert frontend business type label to backend API value
 */
export function toBackendBusinessType(frontendType: string): string {
  return businessTypeToBackend[frontendType] || frontendType;
}

/**
 * Convert backend API business type to frontend display label
 */
export function toFrontendBusinessType(backendType: string): string {
  return businessTypeToFrontend[backendType] || backendType;
}

/**
 * Check if business type requires CIN
 */
export function requiresCIN(backendType: string): boolean {
  return businessTypesRequiringCIN.has(backendType);
}

/**
 * Check if business type requires deed upload
 */
export function requiresDeedUpload(backendType: string): boolean {
  return businessTypesRequiringDeed.has(backendType);
}
