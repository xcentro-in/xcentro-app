import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { NotificationItem, ActionButton } from "@/types/notification";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface NotificationActionsProps {
  notification: NotificationItem;
  onClose?: () => void;
}

const getButtonClasses = (buttonType: ActionButton['type']): string => {
  const baseClasses = "h-7 text-xs font-medium transition-colors whitespace-nowrap";

  switch (buttonType) {
    case 'button-positive':
      return cn(baseClasses, "bg-green-600 hover:bg-green-700 text-white border-0");
    case 'button-negative':
      return cn(baseClasses, "bg-red-600 hover:bg-red-700 text-white border-0");
    case 'button-neutral':
      return cn(baseClasses, "bg-muted hover:bg-muted/80 text-foreground");
    case 'link':
      return cn(baseClasses, "text-primary hover:text-primary/80 underline underline-offset-4 bg-transparent border-0 px-2");
    default:
      return cn(baseClasses, "bg-muted hover:bg-muted/80");
  }
};

export const NotificationActions = ({
  notification,
  onClose
}: NotificationActionsProps) => {
  const navigate = useNavigate();

  // Get actions from notification
  const actions = notification.actions;

  // If no actions, don't render anything
  if (!actions || actions.length === 0) return null;

  const handleActionClick = (action: ActionButton, e: React.MouseEvent) => {
    e.stopPropagation();

    // Close modal before navigation for better UX
    if (onClose) {
      onClose();
    }

    // Construct full URL with current hostname
    const fullUrl = `${window.location.origin}${action.href}`;

    // Navigate using router for internal links, or window.location for external
    if (action.href.startsWith('/')) {
      navigate(action.href);
    } else {
      window.location.href = fullUrl;
    }
  };

  return (
    <div className="mt-3 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {actions.map((action, index) => (
        <Button
          key={index}
          className={getButtonClasses(action.type)}
          onClick={(e) => handleActionClick(action, e)}
        >
          {action.text}
          {action.type !== 'link' && <ExternalLink className="ml-1.5 h-3 w-3" />}
        </Button>
      ))}
    </div>
  );
};