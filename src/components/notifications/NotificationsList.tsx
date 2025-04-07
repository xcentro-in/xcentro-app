
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
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <p>No notifications</p>
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
