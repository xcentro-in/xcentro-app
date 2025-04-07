
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NotificationCategoryTabsProps {
  categories: string[];
  activeTab: string;
  totalUnread: number;
  unreadCounts: Record<string, number>;
}

const NotificationCategoryTabs = ({
  categories,
  activeTab,
  totalUnread,
  unreadCounts,
}: NotificationCategoryTabsProps) => {
  return (
    <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1">
      <TabsTrigger 
        value="all" 
        className="justify-start relative w-full"
      >
        All
        {totalUnread > 0 && (
          <span className="absolute right-2 flex h-5 w-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {totalUnread}
          </span>
        )}
      </TabsTrigger>
      
      {categories.map((category) => (
        <TabsTrigger 
          key={category} 
          value={category} 
          className="justify-start relative w-full capitalize"
        >
          {category}
          {unreadCounts[category] > 0 && (
            <span className="absolute right-2 flex h-5 w-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCounts[category]}
            </span>
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default NotificationCategoryTabs;
