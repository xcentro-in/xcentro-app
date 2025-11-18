/**
 * Card Network Utilities
 * Centralized configuration for card network logos, icons, and display names
 */

export interface CardNetworkConfig {
  name: string;
  displayName: string;
  logoUrl: string | null;
  color: string;
}

/**
 * Card network configurations with ImageKit CDN URLs
 */
const CARD_NETWORKS: Record<string, CardNetworkConfig> = {
  visa: {
    name: "visa",
    displayName: "Visa",
    logoUrl: "https://ik.imagekit.io/mddzdzy9m/Xcentro/CardNetworks/visa.png?updatedAt=1763483449070",
    color: "#1A1F71",
  },
  mastercard: {
    name: "mastercard",
    displayName: "Mastercard",
    logoUrl: "https://ik.imagekit.io/mddzdzy9m/Xcentro/CardNetworks/mastercard.png?updatedAt=1763483449014",
    color: "#EB001B",
  },
  amex: {
    name: "amex",
    displayName: "American Express",
    logoUrl: "https://ik.imagekit.io/mddzdzy9m/Xcentro/CardNetworks/amex.png?updatedAt=1763497581720",
    color: "#006FCF",
  },
  diners: {
    name: "diners",
    displayName: "Diners Club",
    logoUrl: "https://ik.imagekit.io/mddzdzy9m/Xcentro/CardNetworks/dinersclub.png?updatedAt=1763483448986",
    color: "#0079BE",
  },
  diners_carte: {
    name: "diners_carte",
    displayName: "Diners Club Carte Blanche",
    logoUrl: "https://ik.imagekit.io/mddzdzy9m/Xcentro/CardNetworks/dinersclub.png?updatedAt=1763483448986",
    color: "#0079BE",
  },
  rupay: {
    name: "rupay",
    displayName: "RuPay",
    logoUrl: "https://ik.imagekit.io/mddzdzy9m/Xcentro/CardNetworks/rupay.png?updatedAt=1763483449036",
    color: "#097939",
  },
  discover: {
    name: "discover",
    displayName: "Discover",
    logoUrl: null,
    color: "#FF6000",
  },
  jcb: {
    name: "jcb",
    displayName: "JCB",
    logoUrl: null,
    color: "#0E4C96",
  },
  maestro: {
    name: "maestro",
    displayName: "Maestro",
    logoUrl: null,
    color: "#0099DF",
  },
  sodexo: {
    name: "sodexo",
    displayName: "Sodexo",
    logoUrl: null,
    color: "#E11E26",
  },
};

/**
 * Get card network logo URL
 * @param cardType - Card network type (e.g., "visa", "mastercard")
 * @returns Logo URL or null if not available
 */
export function getCardNetworkLogo(cardType: string): string | null {
  const network = CARD_NETWORKS[cardType.toLowerCase()];
  return network?.logoUrl || null;
}

/**
 * Get card network display name
 * @param cardType - Card network type (e.g., "visa", "mastercard")
 * @returns Human-readable display name
 */
export function getCardNetworkDisplayName(cardType: string): string {
  const network = CARD_NETWORKS[cardType.toLowerCase()];
  return network?.displayName || "Unknown";
}

/**
 * Get card network brand color
 * @param cardType - Card network type (e.g., "visa", "mastercard")
 * @returns Hex color code
 */
export function getCardNetworkColor(cardType: string): string {
  const network = CARD_NETWORKS[cardType.toLowerCase()];
  return network?.color || "#64748B"; // Default slate-500
}

/**
 * Get all card network configurations
 * @returns Record of all card networks
 */
export function getAllCardNetworks(): Record<string, CardNetworkConfig> {
  return CARD_NETWORKS;
}

/**
 * Check if a card network is supported
 * @param cardType - Card network type to check
 * @returns true if supported, false otherwise
 */
export function isCardNetworkSupported(cardType: string): boolean {
  return cardType.toLowerCase() in CARD_NETWORKS;
}

/**
 * Get list of all supported card network names
 * @returns Array of card network names
 */
export function getSupportedCardNetworks(): string[] {
  return Object.keys(CARD_NETWORKS);
}
