
import { 
  Home, 
  CreditCard, 
  Gift, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Clock,
  Repeat,
  FileText,
  Upload,
  Link2,
  UserCog
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Main menu items
const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "Rewards",
    url: "/rewards",
    icon: Gift,
  },
  {
    title: "Insights",
    url: "/insights",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const AppSidebar = () => {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <span className={cn(
            "font-semibold text-lg transition-all duration-200",
            open ? "opacity-100" : "opacity-0 w-0"
          )}>
            PayStrive
          </span>
        </div>
        <SidebarTrigger className="rounded-full p-1.5 hover:bg-accent transition-colors">
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </SidebarTrigger>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarMenu>
            {mainMenuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link 
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.url ? 
                      "bg-accent font-medium" : 
                      "hover:bg-accent/50"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    location.pathname === item.url ? 
                      "text-primary" : 
                      "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "transition-all duration-200",
                    open ? "opacity-100" : "opacity-0 w-0"
                  )}>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-4">
        <div className={cn(
          "flex items-center gap-3",
          open ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <UserCog className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Business Account</span>
            <span className="text-xs text-muted-foreground">Admin Access</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
