
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCategoryDisplayName } from "@/lib/notificationUtils";
import { NotificationCategory } from "@/types/notification";

interface NotificationCategoryTabsProps {
  categories: string[];
  activeTab: string;
  unreadCounts: Record<string, number>;
}

const NotificationCategoryTabs = ({
  categories,
  activeTab,
  unreadCounts,
}: NotificationCategoryTabsProps) => {
  return (
    <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1">
      {categories.map((category) => (
        <TabsTrigger
          key={category}
          value={category}
          className="justify-start relative w-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm"
        >
          {getCategoryDisplayName(category as NotificationCategory)}
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
