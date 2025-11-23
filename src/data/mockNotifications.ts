
import { NotificationItem } from "@/types/notification";

export const mockNotifications: NotificationItem[] = [
  {
    id: "notif-001",
    title: "Your subscription is expiring soon",
    message: "Your premium plan will expire in 7 days. Renew now to avoid interruption.",
    time: "10 min ago",
    read: false,
    category: "announcements",
    priority: "high",
    actionUrl: "/settings/subscription",
    actionLabel: "Renew Now"
  },
  {
    id: "notif-002",
    title: "5,000 reward points expiring",
    message: "Your reward points will expire in 14 days. Redeem them before they're gone!",
    time: "1 hour ago",
    read: false,
    category: "rewards",
    priority: "medium",
    actionUrl: "/rewards",
    actionLabel: "Redeem Points"
  },
  {
    id: "notif-003",
    title: "Payment of $2,500 awaiting approval",
    message: "A payment to Acme Services requires your approval before processing.",
    time: "3 hours ago",
    read: false,
    category: "approvals",
    priority: "high",
    actionUrl: "/approvals",
    actionLabel: "Review & Approve"
  },
  {
    id: "notif-004",
    title: "New payee added to your account",
    message: "GlobalTech Inc. has been added to your payee list by Jane Smith.",
    time: "Yesterday",
    read: true,
    category: "payees",
    priority: "medium",
    actionUrl: "/payees",
    actionLabel: "View Payee"
  },
  {
    id: "notif-005",
    title: "Unusual account activity detected",
    message: "We've noticed login attempts from an unrecognized device. Please verify your account security.",
    time: "2 days ago",
    read: false,
    category: "security",
    priority: "high",
    actionUrl: "/settings/security",
    actionLabel: "Review Activity"
  },
  {
    id: "notif-006",
    title: "Monthly spend report available",
    message: "Your spending analysis for August 2023 is now ready to view.",
    time: "3 days ago",
    read: true,
    category: "insights",
    priority: "low",
    actionUrl: "/insights",
    actionLabel: "View Report"
  },
  {
    id: "notif-007",
    title: "Upcoming scheduled payment",
    message: "Your quarterly tax payment of $4,750 is scheduled for tomorrow.",
    time: "3 days ago",
    read: true,
    category: "payments",
    priority: "medium",
    actionUrl: "/payments",
    actionLabel: "View Details"
  },
  {
    id: "notif-008",
    title: "Earn 3x points this week",
    message: "Limited time offer: Earn triple points on all business software purchases until Friday.",
    time: "4 days ago",
    read: true,
    category: "rewards",
    priority: "low",
    actionUrl: "/rewards",
    actionLabel: "Learn More"
  }
];
