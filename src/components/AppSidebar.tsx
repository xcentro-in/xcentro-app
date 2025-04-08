
import { 
  Sidebar, 
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenu } from "./sidebar/SidebarMenu";
import { SidebarFooter } from "./sidebar/SidebarFooter";

const AppSidebar = () => {
  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border" collapsible="icon">
      <SidebarHeader />
      <SidebarContent className="px-2 mt-2">
        <SidebarMenu />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
    </SidebarProvider>
  );
};

export default AppSidebar;
