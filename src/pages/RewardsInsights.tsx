
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RewardsHeader from "@/components/rewards/RewardsHeader";
import RewardsHistory from "./RewardsHistory";
import RedemptionHistory from "./RedemptionHistory";

const RewardsInsights = () => {
  const [activeTab, setActiveTab] = useState<string>("redemption");
  const location = useLocation();

  // Check if we should load a specific tab from URL state
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  return (
    <div className="space-y-8">
      <RewardsHeader 
        title="Rewards Insights" 
        description="Track your rewards earning and redemption history" 
      />
      
      <div className="flex justify-center w-full">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="earning">Earning History</TabsTrigger>
              <TabsTrigger value="redemption">Redemption History</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="earning" className="mt-0">
            <RewardsHistory embeddedView={true} />
          </TabsContent>
          
          <TabsContent value="redemption" className="mt-0">
            <RedemptionHistory embeddedView={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RewardsInsights;
