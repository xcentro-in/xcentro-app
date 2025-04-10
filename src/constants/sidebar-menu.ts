
import { 
  Home, 
  CreditCard,
  History,
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
  BarChart2,
  CreditCardIcon,
  FileText,
  Banknote,
  Award,
  TrendingUp,
  ReceiptIcon,
  BarChart,
  LineChart,
  ReceiptText,
  UserRound,
} from "lucide-react";

// Define interface for the menu items
export interface SidebarMenuItem {
  title: string;
  url: string;
  icon: any; // Using 'any' here to accommodate Lucide icons
  highlight?: boolean;
  highlightColor?: "amber" | "green";
  state?: any;
  submenu?: Array<{
    title: string;
    url: string;
    icon: any;
  }>;
}

// Main menu items
export const mainMenuItems: SidebarMenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "New Payment",
    url: "/new-payment",
    icon: PlusCircle,
    highlight: true,
    highlightColor: "green" as const,
  },
  {
    title: "Upcoming Payments",
    url: "/payment-calendar",
    icon: CalendarDays,
  },
  {
    title: "Payment History",
    url: "/payments",
    icon: History,
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
    title: "Credit Cards",
    url: "/credit-cards",
    icon: CreditCardIcon,
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
    title: "Approvals",
    url: "/approvals",
    icon: CheckCircle2,
    highlight: true,
  },
  {
    title: "My Rewards",
    url: "/rewards",
    icon: Gift,
    highlight: true,
    submenu: [
      {
        title: "Dashboard",
        url: "/rewards",
        icon: Award,
      },
      {
        title: "Insights",
        url: "/rewards/insights",
        icon: BarChart3,
      }
    ]
  },
  {
    title: "Insights",
    url: "/insights",
    icon: BarChart3,
    submenu: [
      {
        title: "Business Analytics",
        url: "/insights",
        icon: BarChart,
      },
      {
        title: "Cash Flow Projection",
        url: "/cash-flow-projection",
        icon: LineChart,
      },
      {
        title: 'GST Reports',
        icon: ReceiptText,
        url: '/gst-reports',
      },
      {
        title: 'Payroll Report',
        icon: UserRound,
        url: '/payroll-report',
      }
    ]
  },
  
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
