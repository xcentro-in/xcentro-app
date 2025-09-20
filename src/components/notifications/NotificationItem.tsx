
import { cn } from "@/lib/utils";
import { NotificationItem as NotificationItemType } from "@/types/notification";
import { PriorityIndicator } from "./components/PriorityIndicator";
import { NotificationHeader } from "./components/NotificationHeader";
import { NotificationActions } from "./components/NotificationActions";
import { NotificationCategory } from "./components/NotificationCategory";
import { notificationStyles } from "./styles";

interface NotificationItemProps {
  notification: NotificationItemType;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  handleNavigate: (notification: NotificationItemType) => void;
}

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDismiss,
  handleNavigate,
}: NotificationItemProps) => {
  const { container } = notificationStyles;
  
  return (
    <div 
      key={notification.id} 
      className={cn(
        container.base,
        notification.read ? container.read : container.unread,
        container.hover
      )}
      onClick={() => handleNavigate(notification)}
    >
      <div className="flex items-start gap-3">
        <div>
          <PriorityIndicator priority={notification.priority} />
        </div>
        
        <div className="flex-1">
          <NotificationHeader
            title={notification.title}
            time={notification.time}
            isRead={notification.read}
          />
          
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
          
          <NotificationActions
            notificationId={notification.id}
            actionLabel={notification.actionLabel}
            onMarkAsRead={onMarkAsRead}
            onDismiss={onDismiss}
            onAction={handleNavigate}
            notification={notification}
          />
          
          <div className="mt-1.5">
            <NotificationCategory category={notification.category} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
