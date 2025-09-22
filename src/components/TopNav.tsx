import { Bell, LogOut, ChevronDown, Settings, Users, Star, Building, AlertCircle, Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockBusinesses } from "@/data/mockBusinesses";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutConfirmationDialog from "./LogoutConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import NotificationPopup from "./notifications/NotificationPopup";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { FeatureEnabled } from "./FeatureEnabled";
import { useAuth } from "@/contexts/AuthContext";

const TopNav = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { title } = usePageTitle();
  const { user, logout: authLogout } = useAuth();
  
  const {
    notifications,
    unreadCount,
    isOpen: notificationsOpen,
    openNotifications,
    closeNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification
  } = useNotifications();
  
  const handleLogout = () => {
    // TODO: This will call the actual backend logout API
    authLogout();

    // Show success toast
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });

    // Redirect to login page (or home page)
    navigate("/");
  };
  
  return (
    <header className="h-16 border-b border-border px-6 flex items-center justify-between z-20 bg-background/90 backdrop-blur-sm">
      <div className="flex-1">
        {title && (
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        )}
        <div className={cn("peer-data-[state=collapsed]/sidebar:block", title ? "hidden" : "block")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="h-6 w-6 rounded bg-indigo-100 flex items-center justify-center">
                  <Building className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <span className="font-medium">{user?.businessName || "ABC Company"}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
              {mockBusinesses.map(business => (
                <DropdownMenuItem key={business.id} className="flex items-center gap-2 py-2">
                  <div className="h-8 w-8 rounded bg-indigo-100 flex items-center justify-center">
                    <Building className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{business.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {business.status === "verified" ? 
                        <span className="flex items-center gap-1 text-green-600">
                          <Check className="h-3 w-3" /> Verified
                        </span> : 
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="h-3 w-3" /> Pending
                        </span>
                      }
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <FeatureEnabled featureFlag="REWARD_POINT_SYSTEM">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1.5 pr-3 hidden md:flex"
            onClick={() => navigate('/rewards')}
          >
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-amber-500/10">
              <Star className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <span className="font-medium">{user?.rewardPoints?.toLocaleString() || "24,530"}</span>
            <span className="text-xs text-muted-foreground">points</span>
          </Button>
        </FeatureEnabled>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={openNotifications}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground animate-scale-in">
              {unreadCount}
            </span>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-9 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2 cursor-pointer">
                {!isMobile && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium leading-none">
                      {user?.name || "Arvind Mehta"}
                    </span>
                    <span className="text-xs text-muted-foreground leading-tight">
                      {user?.businessName || "ABC Company"}
                    </span>
                  </div>
                )}
                <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-popover shadow-lg rounded-lg border border-border p-1 mt-1"
          >
            <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem 
              className="flex items-center px-3 py-2 cursor-pointer"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <FeatureEnabled featureFlag="REFERRAL_SYSTEM">
              <DropdownMenuItem 
                className="flex items-center px-3 py-2 cursor-pointer"
                onClick={() => navigate('/network', { state: { activeTab: "referrals" } })}
              >
                <Users className="h-4 w-4 mr-2" />
                Referrals
              </DropdownMenuItem>
            </FeatureEnabled>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem 
              className="flex items-center px-3 py-2 cursor-pointer text-destructive hover:text-destructive focus:text-destructive"
              onClick={() => setLogoutDialogOpen(true)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <LogoutConfirmationDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleLogout}
      />

      <NotificationPopup
        isOpen={notificationsOpen}
        onClose={closeNotifications}
        notifications={notifications}
        onMarkAllAsRead={markAllAsRead}
        onMarkAsRead={markAsRead}
        onDismiss={dismissNotification}
      />
    </header>
  );
};

export default TopNav;
