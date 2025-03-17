
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarMenuItem as MenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarMenuItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
  highlight?: boolean;
}

export const SidebarMenuItemComponent = ({ title, url, icon: Icon, highlight }: SidebarMenuItemProps) => {
  const { open } = useSidebar();
  const location = useLocation();
  const isActive = location.pathname === url;

  return (
    <MenuItem key={title} className="w-full">
      <SidebarMenuButton
        isActive={isActive}
        tooltip={!open ? title : undefined}
        asChild
        className={cn(
          highlight ? "relative" : "",
          "w-full"
        )}
      >
        <Link to={url} className={cn(
          "flex items-center gap-3 w-full",
          !open && "justify-center" // Center align when sidebar is collapsed
        )}>
          {highlight && !isActive && (
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-amber-500"></span>
          )}
          <Icon className={cn(
            "h-5 w-5",
            isActive ? 
              "text-primary" : 
              highlight && !isActive ? "text-amber-500" : "text-muted-foreground"
          )} />
          {open && (
            <span className={cn(
              "truncate",
              highlight && !isActive && "text-amber-500 font-medium"
            )}>
              {title}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </MenuItem>
  );
};
