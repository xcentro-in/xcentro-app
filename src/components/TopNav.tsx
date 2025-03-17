
import { Bell, Search, LogOut, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { Star } from "lucide-react";
import LogoutConfirmationDialog from "./LogoutConfirmationDialog";
import { useToast } from "@/hooks/use-toast";

const TopNav = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  
  const handleLogout = () => {
    // Here you would implement actual logout logic
    // For example: authService.logout();
    
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
      <div className="flex items-center gap-3 w-full max-w-lg">
        <div className={cn(
          "relative flex items-center w-full transition-all duration-300",
          searchFocused ? "w-full" : "w-full"
        )}>
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input 
            placeholder="Search transactions, vendors..." 
            className={cn(
              "pl-9 bg-muted/50 border-muted focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring transition-all",
              searchFocused ? "w-full" : "w-full"
            )}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1.5 pr-3 hidden md:flex"
          onClick={() => navigate('/rewards')}
        >
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-amber-500/10">
            <Star className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <span className="font-medium">24,530</span>
          <span className="text-xs text-muted-foreground">points</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground animate-scale-in">
              {notifications}
            </span>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
              </Avatar>
              {!isMobile && (
                <div className="flex items-center">
                  <div className="flex flex-col mr-1">
                    <span className="text-sm font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground">ABC Company</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/wallet')}>
              Manage Payment Methods
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/rewards')}>
              My Rewards
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
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
    </header>
  );
};

export default TopNav;
