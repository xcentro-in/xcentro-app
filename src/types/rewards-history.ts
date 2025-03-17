
export interface RewardTransaction {
  id: string;
  vendor: string;
  amount: number;
  points: number;
  date: string;
  type: 'single' | 'recurring' | 'batch' | 'bonus';
  hasBonus: boolean;
  basePoints: number;
  bonusPoints: number;
  paymentMethod: string;
  description: string;
}

export interface PointsSummary {
  totalPoints: number;
  last30DaysPoints: number;
  pendingPoints: number;
  redeemedPoints: number;
  availablePoints: number;
}

export interface ChartDataPoint {
  month: string;
  points: number;
}

export interface CategoryDataPoint {
  category: string;
  points: number;
}
