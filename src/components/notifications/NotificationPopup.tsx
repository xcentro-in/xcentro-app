
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { NotificationItem } from "@/types/notification";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-xl">Notifications</DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMarkAllAsRead}
              className="text-sm"
              disabled={totalUnread === 0}
            >
              <Check className="mr-1 h-4 w-4" />
              Mark all as read
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-4">
              <TabsList>
                <TabsTrigger value="all" className="relative">
                  All
                  {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {totalUnread}
                    </span>
                  )}
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="capitalize relative">
                    {category}
                    {unreadCounts[category] > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        {unreadCounts[category]}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <ScrollArea className="max-h-[60vh] min-h-[300px] pr-4">
              {sortedNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  {sortedNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "p-3 border rounded-lg relative transition-colors",
                        notification.read ? "bg-card" : "bg-accent/20",
                        "hover:bg-accent/30 cursor-pointer"
                      )}
                      onClick={() => handleNavigate(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div>
                          {/* Priority indicator */}
                          <div 
                            className={cn(
                              "w-2 h-2 rounded-full mt-2",
                              notification.priority === "high" && "bg-destructive",
                              notification.priority === "medium" && "bg-amber-500",
                              notification.priority === "low" && "bg-green-500"
                            )}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className={cn("font-medium text-sm", !notification.read && "font-semibold")}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-muted-foreground ml-2">
                              {notification.time}
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          
                          {notification.actionLabel && (
                            <div className="mt-2 flex items-center">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNavigate(notification);
                                }}
                              >
                                {notification.actionLabel}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs ml-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkAsRead(notification.id);
                                }}
                              >
                                Mark as read
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs ml-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDismiss(notification.id);
                                }}
                              >
                                Dismiss
                              </Button>
                            </div>
                          )}
                          
                          <div className="mt-1.5">
                            <span className={cn(
                              "inline-block px-2 py-0.5 text-xs rounded-full capitalize",
                              notification.category === "announcements" && "bg-blue-100 text-blue-800",
                              notification.category === "rewards" && "bg-amber-100 text-amber-800",
                              notification.category === "payments" && "bg-green-100 text-green-800",
                              notification.category === "payees" && "bg-purple-100 text-purple-800",
                              notification.category === "approvals" && "bg-indigo-100 text-indigo-800",
                              notification.category === "security" && "bg-red-100 text-red-800",
                              notification.category === "insights" && "bg-cyan-100 text-cyan-800"
                            )}>
                              {notification.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPopup;
