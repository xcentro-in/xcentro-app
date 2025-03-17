
import { LoyaltyPartner } from "@/types/rewards";

export type PartnerType = "airline" | "hotel" | "car" | "other";

export const partnerSuggestions: Record<PartnerType, { value: string, label: string }[]> = {
  airline: [
    { value: "emirates", label: "Emirates Skywards" },
    { value: "delta", label: "Delta SkyMiles" },
    { value: "airIndia", label: "Air India Flying Returns" },
    { value: "united", label: "United MileagePlus" },
    { value: "lufthansa", label: "Lufthansa Miles & More" },
    { value: "british", label: "British Airways Executive Club" },
  ],
  hotel: [
    { value: "marriott", label: "Marriott Bonvoy" },
    { value: "hilton", label: "Hilton Honors" },
    { value: "hyatt", label: "World of Hyatt" },
    { value: "ihg", label: "IHG One Rewards" },
    { value: "accor", label: "Accor Live Limitless" },
    { value: "radisson", label: "Radisson Rewards" },
  ],
  car: [
    { value: "hertz", label: "Hertz Gold Plus Rewards" },
    { value: "avis", label: "Avis Preferred" },
    { value: "enterprise", label: "Enterprise Plus" },
    { value: "budget", label: "Budget Fastbreak" },
  ],
  other: [
    { value: "amex", label: "American Express Membership Rewards" },
    { value: "chase", label: "Chase Ultimate Rewards" },
    { value: "starbucks", label: "Starbucks Rewards" },
    { value: "target", label: "Target Circle" },
  ]
};

export const getDefaultPartnerValues = (partnerId?: string): Partial<LoyaltyPartner> => {
  return {
    id: partnerId || `partner-${Date.now()}`,
    name: "",
    type: "other",
    category: "",
    membershipDetails: {
      membershipNumber: "",
      registeredName: "",
      email: ""
    }
  };
};

export const getCategoryFromType = (type: PartnerType): string => {
  switch(type) {
    case "airline":
      return "flights";
    case "hotel":
      return "hotels";
    case "car":
      return "travel";
    default:
      return "business";
  }
};
