
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem as NotificationItemType } from "@/types/notification";
import NotificationItemComponent from "./NotificationItem";

interface NotificationsListProps {
  notifications: NotificationItemType[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  handleNavigate: (notification: NotificationItemType) => void;
}

const NotificationsList = ({
  notifications,
  onMarkAsRead,
  onDismiss,
  handleNavigate,
}: NotificationsListProps) => {
  return (
    <ScrollArea className="h-full pr-4">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">No notifications in this category</p>
            <p className="text-xs text-muted-foreground">Check other categories or come back later</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItemComponent
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDismiss={onDismiss}
              handleNavigate={handleNavigate}
            />
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default NotificationsList;
