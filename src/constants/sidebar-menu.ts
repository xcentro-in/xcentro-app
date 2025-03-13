
import { 
  Home, 
  CreditCard, 
  Gift, 
  BarChart3, 
  Settings,
  PlusCircle,
  Users,
  Wallet,
  Star,
  CheckCircle2
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
    title: "Manage Payees",
    url: "/payees",
    icon: Users,
  },
  {
    title: "Wallet",
    url: "/wallet",
    icon: Wallet,
  },
  {
    title: "Approvals",
    url: "/approvals",
    icon: CheckCircle2,
    highlight: true,
  },
  {
    title: "My Rewards",
    url: "/rewards",
    icon: Star,
    highlight: true,
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
