
export interface RedemptionItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  image?: string;
  conversionRatio?: number; // For partner programs (e.g., 1 PaySphere point = 0.5 partner points)
}

export interface RedemptionCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  pointsNeeded: number;
  items: RedemptionItem[];
}

export interface LoyaltyPartner {
  id: string;
  name: string;
  type: 'airline' | 'hotel' | 'other';
  conversionRatio: number; // How many partner points per 1 PaySphere point
  category: string; // Maps to a category ID in redemptionCategories
  membershipDetails?: {
    membershipNumber?: string;
    registeredName?: string;
    email?: string;
    preferredSettings?: string;
  };
}
