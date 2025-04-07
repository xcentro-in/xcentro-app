
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NotificationItem } from "@/types/notification";
import { Separator } from "@/components/ui/separator";
import NotificationCategoryTabs from "./NotificationCategoryTabs";
import NotificationsList from "./NotificationsList";

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const NotificationPopup = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onDismiss,
}: NotificationPopupProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<string>("all");

  // Group notifications by category
  const categories = ["announcements", "rewards", "payments", "payees", "approvals", "security", "insights"];
  
  // Count unread by category
  const unreadCounts = categories.reduce((acc, category) => {
    acc[category] = notifications.filter(
      (notification) => notification.category === category && !notification.read
    ).length;
    return acc;
  }, {} as Record<string, number>);
  
  const totalUnread = notifications.filter(notification => !notification.read).length;

  const handleNavigate = (notification: NotificationItem) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(notification => notification.category === activeTab);

  // Sort notifications by priority (high to low)
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    // First by read status (unread first)
    if (a.read !== b.read) return a.read ? 1 : -1;
    
    // Then by priority (high to low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <DialogTitle className="text-xl">Notifications</DialogTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onMarkAllAsRead}
                className="text-sm self-start mt-1"
                disabled={totalUnread === 0}
              >
                <Check className="mr-1 h-4 w-4" />
                Mark all as read
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex mt-4 h-[60vh]">
              {/* Vertical tabs on the left */}
              <div className="w-[180px] border-r border-border pr-1">
                <NotificationCategoryTabs
                  categories={categories}
                  activeTab={activeTab}
                  totalUnread={totalUnread}
                  unreadCounts={unreadCounts}
                />
              </div>
              
              {/* Separator line */}
              <Separator orientation="vertical" className="mx-2" />
              
              {/* Notifications content on the right */}
              <div className="flex-1 pl-2">
                <NotificationsList
                  notifications={sortedNotifications}
                  onMarkAsRead={onMarkAsRead}
                  onDismiss={onDismiss}
                  handleNavigate={handleNavigate}
                />
              </div>
            </div>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPopup;
