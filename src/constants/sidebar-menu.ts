
import { 
  Home, 
  CreditCard, 
  Gift, 
  BarChart3, 
  Settings,
  PlusCircle
} from "lucide-react";

// Main menu items
export const mainMenuItems = [
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
    title: "New Payment",
    url: "/new-payment",
    icon: PlusCircle,
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
