
import { 
  Home, 
  History,
  Gift, 
  BarChart3, 
  PlusCircle,
  Users,
  Wallet,
  CheckCircle2,
  CalendarDays,
  Receipt,
  BarChart2,
  CreditCardIcon,
  Award,
  BarChart,
  LineChart,
  ReceiptText,
  Landmark,
  Milestone,
  FileText,
} from "lucide-react";

// Define interface for the menu items
export interface SidebarMenuItem {
  id: string;
  title: string;
  url: string;
  icon: any; // Using 'any' here to accommodate Lucide icons
  highlight?: boolean;
  highlightColor?: "amber" | "green";
  state?: any;
  requiresAccess?: boolean; // New field for access control
  submenu?: Array<{
    id: string;
    title: string;
    url: string;
    icon: any;
  }>;
}

// Main menu items
export const mainMenuItems: SidebarMenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    id: "newpayment",
    title: "New Payment",
    url: "/new-payment",
    icon: PlusCircle,
    highlight: true,
    highlightColor: "green" as const,
    requiresAccess: true,
  },
  {
    id: "upcomingpayments",
    title: "Upcoming Payments",
    url: "/payment-calendar",
    icon: CalendarDays,
    requiresAccess: true,
  },
  {
    id: "paymenthistory",
    title: "Payment History",
    url: "/payments",
    icon: History,
    requiresAccess: true,
  },
  {
    id: "managepayees",
    title: "Manage Payees",
    url: "/payees",
    icon: Users,
    requiresAccess: true,
  },
  {
    id: "bills",
    title: "Bills",
    url: "/bills",
    icon: FileText,
    requiresAccess: true,
  },
  {
    id: "wallet",
    title: "Wallet",
    url: "/wallet",
    icon: Wallet,
  },
  {
    id: "creditcard",
    title: "Credit Cards",
    url: "/credit-cards",
    icon: CreditCardIcon,
    submenu: [
      {
        id: "cardBillPayment",
        title: "Card Bill Payment",
        url: "/credit-card-bills",
        icon: Receipt,
      },
      {
        id: "cardInsightsAnalytics",
        title: "Card Insights & Analytics",
        url: "/credit-card-analytics",
        icon: BarChart2,
      }
    ]
  },
  {
    id: "approvals",
    title: "Approvals",
    url: "/approvals",
    icon: CheckCircle2,
    highlight: true,
    requiresAccess: true,
  },
  {
    id: "rewardmanagement",
    title: "My Rewards",
    url: "/rewards",
    icon: Gift,
    highlight: true,
    submenu: [
      {
        id: "rewardsDashboard",
        title: "Dashboard",
        url: "/rewards",
        icon: Award,
      },
      {
        id: "rewardsHistory",
        title: "History",
        url: "/rewards/history",
        icon: History,
      },
      {
        id: "rewardsMilestones",
        title: "Milestones",
        url: "/rewards/milestones",
        icon: Milestone
      }
    ]
  },
  {
    id: "businessanalytics",
    title: "Business Reports",
    url: "/insights",
    icon: BarChart3,
    submenu: [
      {
        id: "expenseAnalytics",
        title: "Expense Analytics",
        url: "/insights",
        icon: BarChart,
      },
      {
        id: "cashFlowProjection",
        title: "Cash Flow Projection",
        url: "/cash-flow-projection",
        icon: LineChart,
      },
      {
        id: "gstReports",
        title: 'GST Reports',
        icon: ReceiptText,
        url: '/gst-reports',
      },
      {
        id: "payrollReport",
        title: 'Payroll Report',
        icon: Landmark,
        url: '/payroll-report',
      }
    ]
  }
];
