
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
  CheckCircle2,
  CalendarDays,
  Receipt,
  CreditCardIcon, // New import for submenu icon
  BarChart2, // New import for analytics icon
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
    title: "Credit Cards",
    url: "/credit-cards",
    icon: CreditCard,
    submenu: [
      {
        title: "Card Bill Payment",
        url: "/credit-card-bills",
        icon: Receipt,
      },
      {
        title: "Card Insights & Analytics",
        url: "/credit-card-analytics",
        icon: BarChart2,
      }
    ]
  },
  {
    title: "Payment Calendar",
    url: "/payment-calendar",
    icon: CalendarDays,
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
