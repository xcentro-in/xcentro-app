
import {
  LayoutDashboard,
  Wallet,
  ArrowUpDown,
  Users,
  CreditCard,
  Calendar,
  ClipboardList,
  Gift,
  Settings,
  Bell,
  PieChart,
  Building,
  FileText,
  Clock,
} from "lucide-react";

export const sidebarMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Payments",
    icon: ArrowUpDown,
    items: [
      {
        title: "Make Payment",
        href: "/new-payment",
      },
      {
        title: "Payment History",
        href: "/payments",
      },
      {
        title: "Upcoming Payments",
        href: "/upcoming-payments",
      },
      {
        title: "Payment Calendar",
        href: "/payment-calendar",
      },
    ],
  },
  {
    title: "Credit Cards",
    icon: CreditCard,
    items: [
      {
        title: "Card Management",
        href: "/credit-cards",
      },
      {
        title: "Card Bills",
        href: "/credit-card-bills",
      },
      {
        title: "Analytics",
        href: "/credit-card-analytics",
      },
    ],
  },
  {
    title: "Payees",
    icon: Users,
    href: "/payees",
  },
  {
    title: "Invoices",
    icon: FileText,
    href: "/pay-invoice",
  },
  {
    title: "Approvals",
    icon: ClipboardList,
    href: "/approvals",
  },
  {
    title: "Rewards",
    icon: Gift,
    items: [
      {
        title: "Overview",
        href: "/rewards",
      },
      {
        title: "History",
        href: "/rewards-history",
      },
      {
        title: "Redeem",
        href: "/redemption",
      },
    ],
  },
  {
    title: "Wallet",
    icon: Wallet,
    href: "/wallet",
  },
  {
    title: "Insights",
    icon: PieChart,
    href: "/insights",
  },
  {
    title: "Businesses",
    icon: Building,
    href: "/business-onboarding",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "User Access",
    icon: Users,
    href: "/user-access",
  },
];
