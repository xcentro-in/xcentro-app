
import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import TransferPoints from "@/components/network/TransferPoints";
import Referrals from "@/components/network/Referrals";
import { Button } from "@/components/ui/button";
import { Send, Users } from "lucide-react";
import { useLocation } from "react-router-dom";
import { usePageTitle } from "@/contexts/PageTitleContext";

const Network = () => {
  const [activeTab, setActiveTab] = useState<string>("transfers");
  const location = useLocation();
  const { setTitle } = usePageTitle();
  
  useEffect(() => {
    setTitle("Business Network");
  }, [setTitle]);
  
  // Check if the location state contains a tab to activate
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Extend value and influence across your business network
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={activeTab === "transfers" ? "default" : "outline"}
            size="icon"
            onClick={() => setActiveTab("transfers")}
            title="Transfer Points"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTab === "referrals" ? "default" : "outline"}
            size="icon"
            onClick={() => setActiveTab("referrals")}
            title="Referrals"
          >
            <Users className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card className="border bg-card">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsContent value="transfers" className="p-6 space-y-6">
            <TransferPoints />
          </TabsContent>
          
          <TabsContent value="referrals" className="p-6 space-y-6">
            <Referrals />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Network;
