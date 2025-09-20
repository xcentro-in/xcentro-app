import { cn } from "@/lib/utils";

interface NotificationHeaderProps {
  title: string;
  time: string;
  isRead: boolean;
}

export const NotificationHeader = ({ title, time, isRead }: NotificationHeaderProps) => (
  <div className="flex justify-between items-start">
    <h4 className={cn("font-medium text-sm", !isRead && "font-semibold")}>
      {title}
    </h4>
    <span className="text-xs text-muted-foreground ml-2">
      {time}
    </span>
  </div>
);