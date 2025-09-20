import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { NotificationItem } from "@/types/notification";

interface NotificationActionsProps {
  notificationId: string;
  actionLabel?: string;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onAction: (notification: NotificationItem) => void;
  notification: NotificationItem;
}

export const NotificationActions = ({
  notificationId,
  actionLabel,
  onMarkAsRead,
  onDismiss,
  onAction,
  notification
}: NotificationActionsProps) => {
  if (!actionLabel) return null;

  return (
    <div className="mt-2 flex items-center">
      <Button 
        variant="outline" 
        size="sm"
        className="h-7 text-xs"
        onClick={(e) => {
          e.stopPropagation();
          onAction(notification);
        }}
      >
        {actionLabel}
        <ExternalLink className="ml-1 h-3 w-3" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs ml-2"
        onClick={(e) => {
          e.stopPropagation();
          onMarkAsRead(notificationId);
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
          onDismiss(notificationId);
        }}
      >
        Dismiss
      </Button>
    </div>
  );
};