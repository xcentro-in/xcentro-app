
import { CARD_COLORS } from "../ChartComponents";

export interface CardData {
  cardName: string;
  totalSpend: number;
  rewardsEarned: number;
  lateFees: number;
  interestCharged: number;
  otherPenalties: number;
  utilizationRate: number;
  categories: Array<{ name: string; value: number }>;
  latePaymentHistory: Array<{ month: number; fees: number }>;
  cardIndex: number;
}

// Generate data for utilization chart
export const generateUtilizationData = (cardData: CardData[]) => {
  return cardData.map(card => ({
    name: card.cardName,
    value: card.utilizationRate,
    fill: CARD_COLORS[card.cardIndex % CARD_COLORS.length],
  }));
};

// Generate data for hidden charges chart
export const generateHiddenChargesData = (cardData: CardData[]) => {
  return cardData.map(card => ({
    name: card.cardName,
    "Late Fees": card.lateFees,
    "Interest Charged": card.interestCharged,
    "Other Penalties": card.otherPenalties,
    total: card.lateFees + card.interestCharged + card.otherPenalties,
  }));
};

// Generate data for rewards chart
export const generateRewardsData = (cardData: CardData[]) => {
  return [...cardData]
    .sort((a, b) => b.rewardsEarned - a.rewardsEarned)
    .map(card => ({
      name: card.cardName,
      value: card.rewardsEarned,
      fill: CARD_COLORS[card.cardIndex % CARD_COLORS.length],
    }));
};

// Generate data for spending chart
export const generateSpendingData = (cardData: CardData[]) => {
  return cardData.map(card => ({
    name: card.cardName,
    "Total Spend": card.totalSpend,
    "Rewards Earned": card.rewardsEarned,
  }));
};

// Generate data for late payment chart
export const generateLatePaymentData = (cardData: CardData[]) => {
  // Combine all late payment data by month
  const monthlyData = [];
  
  for (let month = 1; month <= 6; month++) {
    const monthEntry = { month: `M${month}` };
    
    cardData.forEach(card => {
      const monthData = card.latePaymentHistory.find(entry => entry.month === month);
      if (monthData) {
        monthEntry[card.cardName] = monthData.fees;
      } else {
        monthEntry[card.cardName] = 0;
      }
    });
    
    monthlyData.push(monthEntry);
  }
  
  return monthlyData;
};

// Find best card (lowest fees to rewards ratio)
export const findBestCard = (cardData: CardData[]) => {
  return cardData.reduce((best, current) => {
    const currentRatio = (current.lateFees + current.interestCharged + current.otherPenalties) / current.rewardsEarned;
    const bestRatio = (best.lateFees + best.interestCharged + best.otherPenalties) / best.rewardsEarned;
    
    return currentRatio < bestRatio ? current : best;
  }, cardData[0]);
};

// Find worst card (highest fees)
export const findWorstCard = (cardData: CardData[]) => {
  return cardData.reduce((worst, current) => {
    const currentFees = current.lateFees + current.interestCharged + current.otherPenalties;
    const worstFees = worst.lateFees + worst.interestCharged + worst.otherPenalties;
    
    return currentFees > worstFees ? current : worst;
  }, cardData[0]);
};

// Find card with highest utilization
export const findHighUtilizationCard = (cardData: CardData[]) => {
  return cardData.reduce((highest, current) => {
    return current.utilizationRate > highest.utilizationRate ? current : highest;
  }, cardData[0]);
};
