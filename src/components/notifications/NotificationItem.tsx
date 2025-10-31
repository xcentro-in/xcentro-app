
import { cn } from "@/lib/utils";
import { NotificationItem as NotificationItemType } from "@/types/notification";
import { NotificationHeader } from "./components/NotificationHeader";
import { NotificationActions } from "./components/NotificationActions";
import { notificationStyles } from "./styles";

interface NotificationItemProps {
  notification: NotificationItemType;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id:string) => void;
  handleNavigate: (notification: NotificationItemType) => void;
}

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDismiss,
  handleNavigate,
}: NotificationItemProps) => {
  const { container } = notificationStyles;

  const hasActions = notification.actions && notification.actions.length > 0;

  const handleClick = () => {
    if (hasActions) {
      if (!notification.read) {
        onMarkAsRead(notification.id);
      }
    } else {
      handleNavigate(notification);
    }
  };

  return (
    <div
      key={notification.id}
      className={cn(
        container.base,
        notification.read ? container.read : container.unread,
        container.hover
      )}
      onClick={handleClick}
    >
      <div className="flex-1">
        <NotificationHeader
          title={notification.title}
          time={notification.time}
          isRead={notification.read}
        />

        <p className="text-sm text-muted-foreground mt-1">
          {notification.message}
        </p>

        <NotificationActions notification={notification} />
      </div>
    </div>
  );
};

export default NotificationItem;
