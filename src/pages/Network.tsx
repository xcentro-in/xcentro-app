
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import TransferPoints from "@/components/network/TransferPoints";
import Referrals from "@/components/network/Referrals";

const Network = () => {
  const [activeTab, setActiveTab] = useState<string>("transfers");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Network</h1>
        <p className="text-muted-foreground">
          Extend value and influence across your business network
        </p>
      </div>
      
      <Card className="border bg-card">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="transfers">Transfer Points</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
          </TabsList>
          
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
