
import React, { useState } from "react";
import { SlidersHorizontal, ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

// Import components
import KeyInsightsCard from "@/components/credit-card-analytics/KeyInsightsCard";
import SmartRecommendations from "@/components/credit-card-analytics/SmartRecommendations";
import CustomizeViewDialog from "@/components/credit-card-analytics/CustomizeViewDialog";
import { 
  SpendingChart, 
  HiddenChargesChart, 
  UtilizationChart, 
  LatePaymentChart,
  RewardsLeaderboard 
} from "@/components/credit-card-analytics";

// Import utilities and data
import { generateMockCardSpendData } from "@/components/credit-card-analytics/mockDataGenerator";
import { 
  generateUtilizationData,
  generateHiddenChargesData,
  generateRewardsData,
  generateSpendingData,
  generateLatePaymentData,
  findBestCard,
  findWorstCard,
  findHighUtilizationCard
} from "@/components/credit-card-analytics/utils/chartDataHelpers";

export default function CreditCardAnalytics() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("3m");
  const [cardData] = useState(generateMockCardSpendData());
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);
  const [viewOptions, setViewOptions] = useState({
    showSpendingChart: true,
    showHiddenChargesChart: true,
    showUtilizationChart: true,
    showLatePaymentChart: true,
    showRewardsChart: true,
    showRecommendations: true,
    compactView: false,
  });

  // Generate chart data
  const utilizationData = generateUtilizationData(cardData);
  const hiddenChargesData = generateHiddenChargesData(cardData);
  const rewardsData = generateRewardsData(cardData);
  const spendingData = generateSpendingData(cardData);
  const latePaymentData = generateLatePaymentData(cardData);

  // Find special cards
  const bestCard = findBestCard(cardData);
  const worstCard = findWorstCard(cardData);
  const highUtilizationCard = findHighUtilizationCard(cardData);

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Credit Card Insights & Analytics</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Comparative analysis of your credit card spending patterns and fees
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Tabs defaultValue="3m" className="w-[200px]" onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="3m">3 Months</TabsTrigger>
            <TabsTrigger value="6m">6 Months</TabsTrigger>
            <TabsTrigger value="12m">12 Months</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Dialog open={customizeDialogOpen} onOpenChange={setCustomizeDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> 
              Customize View
            </Button>
          </DialogTrigger>
          <CustomizeViewDialog 
            open={customizeDialogOpen} 
            onOpenChange={setCustomizeDialogOpen} 
            viewOptions={viewOptions} 
            setViewOptions={setViewOptions} 
          />
        </Dialog>
      </div>
      
      {/* Key Insights Cards */}
      <KeyInsightsCard 
        bestCard={bestCard} 
        worstCard={worstCard} 
        highUtilizationCard={highUtilizationCard} 
      />
      
      {/* Charts Section */}
      <div className="space-y-6">
        {viewOptions.showSpendingChart && <SpendingChart data={spendingData} />}
        {viewOptions.showHiddenChargesChart && <HiddenChargesChart data={hiddenChargesData} />}
        
        <div className="grid gap-6 md:grid-cols-2">
          {viewOptions.showUtilizationChart && <UtilizationChart data={utilizationData} />}
          {viewOptions.showLatePaymentChart && (
            <LatePaymentChart 
              data={latePaymentData} 
              cardNames={cardData.map(card => card.cardName)} 
            />
          )}
        </div>
        
        {viewOptions.showRewardsChart && <RewardsLeaderboard data={rewardsData} />}
      </div>
      
      {/* Recommendations Section */}
      {viewOptions.showRecommendations && (
        <SmartRecommendations 
          bestCard={bestCard} 
          worstCard={worstCard} 
          highUtilizationCard={highUtilizationCard} 
        />
      )}
    </div>
  );
}
