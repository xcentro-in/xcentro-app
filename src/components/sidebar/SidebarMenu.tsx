
import { 
  SidebarGroup,
  SidebarMenu as Menu,
} from "@/components/ui/sidebar";
import { SidebarMenuItemComponent } from "./SidebarMenuItem";
import { mainMenuItems } from "@/constants/sidebar-menu";
import { FeatureFlagName } from "@/lib/featureFlags";
import { FeatureEnabled } from "@/components/FeatureEnabled";
import { SidebarMenuItem } from "@/constants/sidebar-menu";
import { useAuth } from "@/contexts/AuthContext";
import { isMenuItemAccessible, getLockedMessage, getUnlockHint } from "@/config/navigationAccessControl";


const SidebarMenu = () => {
  const { user } = useAuth();
  
  const categoryFeatureFlags: Record<string, FeatureFlagName> = {
    gst: 'GST_PAYMENTS',
    creditcard: 'CREDIT_CARD_MANAGEMENT',
    rewardmanagement: 'REWARD_POINT_SYSTEM',
    businessanalytics: 'BUSINESS_ANALYTICS',
  } as const;

  return (
    <SidebarGroup>
      <Menu>
        {mainMenuItems.map((item: SidebarMenuItem) => {
          const featureFlag = categoryFeatureFlags[item.id] || 'ALLOWED_FIELDS';
          
          // Check access control for items that require it
          const isLocked = item.requiresAccess && !isMenuItemAccessible(item.id, user);
          const lockedMessage = isLocked ? getLockedMessage(item.id) : undefined;
          const unlockHint = isLocked ? getUnlockHint(item.id) : undefined;
          
          return (
            <FeatureEnabled featureFlag={featureFlag} key={item.id}>
              <SidebarMenuItemComponent 
                title={item.title} 
                url={item.url} 
                icon={item.icon}
                highlight={item.highlight}
                highlightColor={item.highlightColor}
                submenu={item.submenu}
                state={item.state}
                isLocked={isLocked}
                lockedMessage={lockedMessage}
                unlockHint={unlockHint}
              />
            </FeatureEnabled>
          );
        })}
      </Menu>
    </SidebarGroup>
  );
};

export default SidebarMenu;
