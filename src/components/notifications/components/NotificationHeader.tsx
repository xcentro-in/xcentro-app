import { cn } from "@/lib/utils";

interface NotificationHeaderProps {
  title: string;
  time: string;
  isRead: boolean;
}

export const NotificationHeader = ({ title, time, isRead }: NotificationHeaderProps) => (
  <div className="flex justify-between items-start">
    <div className="flex items-center gap-2">
      {!isRead && (
        <div className="w-2 h-2 rounded-full bg-primary shrink-0 animate-pulse" />
      )}
      <h4 className={cn("font-medium text-sm", !isRead && "font-semibold text-foreground")}>
        {title}
      </h4>
    </div>
    <span className="text-xs text-muted-foreground ml-2 shrink-0">
      {time}
    </span>
  </div>
);