
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

// Submenu items
const paymentFeatures = [
  { title: "Vendor Management", icon: Users },
  { title: "Upcoming Payments", icon: Clock },
  { title: "Recurring Payments", icon: Repeat },
];

const insightFeatures = [
  { title: "Tax Compliance", icon: FileText },
  { title: "Invoice Upload", icon: Upload },
  { title: "Auto-Sync", icon: Link2 },
];

const AppSidebar = () => {
  const { isOpen } = useSidebar();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Payments": false,
    "Insights": false,
  });

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  return (
    <Sidebar className="border-r border-border z-30 transition-all duration-300">
      <SidebarHeader className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 transition-opacity duration-200 animate-fade-in">
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <span className={cn("font-semibold text-lg transition-all", 
            isOpen ? "opacity-100" : "opacity-0"
          )}>
            PayStrive
          </span>
        </div>
        <SidebarTrigger asChild>
          <button className="rounded-full p-1.5 hover:bg-accent transition-colors">
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </SidebarTrigger>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarMenu>
            {mainMenuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild 
                  className={cn(
                    "group w-full transition-colors",
                    location.pathname === item.url && "bg-accent font-medium"
                  )}
                >
                  <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors",
                      location.pathname === item.url ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    <span className={cn(
                      "transition-all",
                      isOpen ? "opacity-100" : "opacity-0 w-0"
                    )}>
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {isOpen && (
          <>
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel 
                onClick={() => toggleGroup("Payments")}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Payment Features</span>
                <ChevronRight className={cn(
                  "h-4 w-4 transition-transform", 
                  expandedGroups.Payments && "transform rotate-90"
                )} />
              </SidebarGroupLabel>
              
              {expandedGroups.Payments && (
                <SidebarGroupContent className="animate-slide-down">
                  <SidebarMenu>
                    {paymentFeatures.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild className="group pl-4">
                          <div className="flex items-center gap-3 px-3 py-2.5">
                            <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span>{item.title}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>

            <SidebarGroup className="mt-3">
              <SidebarGroupLabel 
                onClick={() => toggleGroup("Insights")}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Business Tools</span>
                <ChevronRight className={cn(
                  "h-4 w-4 transition-transform", 
                  expandedGroups.Insights && "transform rotate-90"
                )} />
              </SidebarGroupLabel>
              
              {expandedGroups.Insights && (
                <SidebarGroupContent className="animate-slide-down">
                  <SidebarMenu>
                    {insightFeatures.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild className="group pl-4">
                          <div className="flex items-center gap-3 px-3 py-2.5">
                            <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span>{item.title}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      
      <SidebarFooter className="mt-auto px-6 py-4">
        <div className={cn(
          "flex items-center gap-3 transition-all",
          isOpen ? "opacity-100" : "opacity-0"
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
