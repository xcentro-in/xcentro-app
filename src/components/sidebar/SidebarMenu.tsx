
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SidebarMenuItem as MenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubButton, useSidebar } from "@/components/ui/sidebar";
import { mainMenuItems } from "@/constants/sidebar-menu";
import { cn } from "@/lib/utils";

export const SidebarMenu = () => {
  const location = useLocation();
  const { open } = useSidebar();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleSubmenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title) 
        : [...prev, title]
    );
  };

  return (
    <div className="flex flex-col gap-1">
      {mainMenuItems.map((item) => {
        const isActive = location.pathname === item.url || 
                         (item.submenu && item.submenu.some(sub => location.pathname === sub.url));
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isExpanded = expandedMenus.includes(item.title);
        
        return (
          <div key={item.title} className="w-full">
            <MenuItem>
              {hasSubmenu ? (
                <SidebarMenuButton
                  onClick={() => toggleSubmenu(item.title)}
                  isActive={isActive}
                  className={cn(
                    "justify-between",
                    item.highlight && "font-medium",
                    item.highlight && item.highlightColor === "amber" && "text-amber-600",
                    item.highlight && item.highlightColor === "green" && "text-green-600"
                  )}
                  tooltip={item.title}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                  {open && (
                    isExpanded ? 
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : 
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    item.highlight && "font-medium",
                    item.highlight && item.highlightColor === "amber" && "text-amber-600",
                    item.highlight && item.highlightColor === "green" && "text-green-600"
                  )}
                  tooltip={item.title}
                >
                  <Link to={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </MenuItem>
            
            {/* Special handling for submenu when sidebar is collapsed */}
            {hasSubmenu && (isExpanded || !open) && (
              <div className={cn(
                "transition-all",
                open ? "ml-4 mt-1" : "absolute left-full top-0 ml-1 w-48 rounded-md border border-border bg-popover shadow-md z-50",
                !open && !isExpanded && "hidden hover:block"
              )}>
                {item.submenu.map((subItem) => (
                  <SidebarMenuSubButton
                    key={subItem.title}
                    asChild
                    isActive={location.pathname === subItem.url}
                    className={!open ? "px-3 py-2" : ""}
                  >
                    <Link to={subItem.url} className="flex items-center gap-2">
                      <subItem.icon className="h-4 w-4" />
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
