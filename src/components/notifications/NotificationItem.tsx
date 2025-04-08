
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { NotificationItem as NotificationItemType } from "@/types/notification";

interface NotificationItemProps {
  notification: NotificationItemType;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  handleNavigate: (notification: NotificationItemType) => void;
}

const NotificationItemComponent = ({
  notification,
  onMarkAsRead,
  onDismiss,
  handleNavigate,
}: NotificationItemProps) => {
  return (
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
  );
};

export default NotificationItemComponent;
