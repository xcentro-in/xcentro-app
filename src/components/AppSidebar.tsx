
import { 
  Sidebar, 
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenu } from "./sidebar/SidebarMenu";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

const AppSidebar = () => {
  const { state, toggleSidebar } = useSidebar();
  
  return (
    <Sidebar className="border-r border-border relative" collapsible="icon">
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 bg-background rounded-full p-1 border border-border shadow-sm hover:bg-accent transition-colors z-10"
      >
        {state === "expanded" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      <SidebarHeader />
      <SidebarContent className="px-2 mt-2">
        <SidebarMenu />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
