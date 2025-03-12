
export interface RedemptionItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  image?: string;
}

export interface RedemptionCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  pointsNeeded: number;
  items: RedemptionItem[];
}
