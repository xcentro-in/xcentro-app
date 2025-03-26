
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarMenuItem as MenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SubmenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  highlight?: boolean;
}

interface SidebarMenuItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
  highlight?: boolean;
  highlightColor?: "amber" | "green";
  state?: any;
  submenu?: SubmenuItem[];
}

export const SidebarMenuItemComponent = ({ 
  title, 
  url, 
  icon: Icon, 
  highlight, 
  highlightColor = "amber",
  state,
  submenu 
}: SidebarMenuItemProps) => {
  const { open } = useSidebar();
  const location = useLocation();
  
  // Check if this item is active based on URL or state
  const isActive = location.pathname === url || 
                  (url === '/new-payment' && 
                   location.pathname === '/new-payment' && 
                   state?.paymentCategory === location.state?.paymentCategory) ||
                  (submenu && submenu.some(item => location.pathname === item.url));
                  
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(isActive);

  // Helper to get the highlight color classes
  const getHighlightColorClasses = (isTextColor = false) => {
    if (highlightColor === "green") {
      return isTextColor ? "text-green-500" : "bg-green-500";
    }
    return isTextColor ? "text-amber-500" : "bg-amber-500";
  };

  // If this is a menu with submenu items
  if (submenu && submenu.length > 0) {
    return (
      <MenuItem key={title} className="w-full">
        <Collapsible
          open={isSubmenuOpen}
          onOpenChange={setIsSubmenuOpen}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={!open ? title : undefined}
              className={cn(
                highlight ? "relative" : "",
                "w-full",
                !open && "justify-center"
              )}
            >
              <div className={cn(
                "flex items-center gap-3 w-full",
                !open && "justify-center"
              )}>
                {highlight && !isActive && (
                  <span className={cn("absolute -left-1 top-1/2 -translate-y-1/2 h-1 w-1 rounded-full", getHighlightColorClasses())}></span>
                )}
                <Icon className={cn(
                  "h-4 w-4",
                  isActive ? 
                    "text-primary" : 
                    highlight && !isActive ? getHighlightColorClasses(true) : "text-muted-foreground"
                )} />
                {open && (
                  <span className={cn(
                    "truncate flex-grow",
                    highlight && !isActive && getHighlightColorClasses(true) + " font-medium"
                  )}>
                    {title}
                  </span>
                )}
                {open && (
                  isSubmenuOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )
                )}
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          
          <CollapsibleContent className={cn(
            "pl-3 mt-1 space-y-1",
            !open && "pl-0"
          )}>
            {submenu.map((item) => (
              <SidebarMenuButton
                key={item.title}
                isActive={location.pathname === item.url}
                tooltip={!open ? item.title : undefined}
                asChild
                className="w-full"
              >
                <Link to={item.url} className={cn(
                  "flex items-center gap-3 w-full",
                  !open && "justify-center"
                )}>
                  <item.icon className={cn(
                    "h-4 w-4",
                    location.pathname === item.url ? 
                      "text-primary" : 
                      "text-muted-foreground"
                  )} />
                  {open && (
                    <span className="truncate text-sm">
                      {item.title}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </MenuItem>
    );
  }

  // Regular menu item without submenu
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
        <Link 
          to={url} 
          state={state}
          className={cn(
            "flex items-center gap-3 w-full",
            !open && "justify-center" // Center align when sidebar is collapsed
          )}
        >
          {highlight && !isActive && (
            <span className={cn("absolute -left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full", getHighlightColorClasses())}></span>
          )}
          <Icon className={cn(
            "h-5 w-5",
            isActive ? 
              "text-primary" : 
              highlight && !isActive ? getHighlightColorClasses(true) : "text-muted-foreground"
          )} />
          {open && (
            <span className={cn(
              "truncate",
              highlight && !isActive && getHighlightColorClasses(true) + " font-medium"
            )}>
              {title}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </MenuItem>
  );
};
