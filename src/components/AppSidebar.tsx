
import { 
  Sidebar, 
  SidebarContent,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenu } from "./sidebar/SidebarMenu";
import { SidebarFooter } from "./sidebar/SidebarFooter";

const AppSidebar = () => {
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarMenu />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
