
import { 
  SidebarGroup,
  SidebarMenu as Menu,
} from "@/components/ui/sidebar";
import { SidebarMenuItemComponent } from "./SidebarMenuItem";
import { mainMenuItems } from "@/constants/sidebar-menu";

export const SidebarMenu = () => {
  return (
    <SidebarGroup>
      <Menu>
        {mainMenuItems.map((item) => (
          <SidebarMenuItemComponent 
            key={item.title} 
            title={item.title} 
            url={item.url} 
            icon={item.icon}
            highlight={item.highlight}
            highlightColor={item.highlightColor === "amber" ? "amber" : "green"}
            submenu={item.submenu}
            state={item.state}
          />
        ))}
      </Menu>
    </SidebarGroup>
  );
};
