
import { Clock, Star, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PayeeTabsProps {
  activeTab: "all" | "favorites" | "recent";
  setActiveTab: (tab: "all" | "favorites" | "recent") => void;
  children: React.ReactNode;
}

const PayeeTabs = ({ activeTab, setActiveTab, children }: PayeeTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "all" | "favorites" | "recent")} className="w-full">
      <div className="flex items-center justify-between mb-2">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="all" className="px-4">
            <User className="h-4 w-4 mr-2" />
            <span>All Payees</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="px-4">
            <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
            <span>Favorites</span>
          </TabsTrigger>
          <TabsTrigger value="recent" className="px-4">
            <Clock className="h-4 w-4 mr-2" />
            <span>Recent</span>
          </TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};

export default PayeeTabs;
