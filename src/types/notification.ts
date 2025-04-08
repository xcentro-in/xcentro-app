
export type NotificationPriority = "high" | "medium" | "low";
export type NotificationCategory = "announcements" | "rewards" | "payments" | "payees" | "approvals" | "security" | "insights";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: NotificationCategory;
  priority: NotificationPriority;
  actionUrl?: string;
  actionLabel?: string;
}
