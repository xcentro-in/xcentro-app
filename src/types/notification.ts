
export type NotificationPriority = "high" | "medium" | "low";
export type NotificationCategory = "payment" | "settlement" | "payee" | "payout" | "report" | "system" | "user" | "announcements" | "rewards" | "approvals" | "security" | "insights";
export type NotificationStatus = "pending" | "processing" | "sent" | "failed" | "read";
export type NotificationChannel = "email" | "push" | "web";

// API Response Types
export interface ActionButton {
  type: 'button-positive' | 'button-negative' | 'button-neutral' | 'link';
  text: string;
  href: string;
}

export interface NotificationContent {
  title: string;
  body: string;
  event_type: string;
  actions?: ActionButton[];
  // Entity references (optional)
  payment_id?: string;
  payee_id?: string;
  voucher_id?: string;
  user_id?: string;
  report_id?: string;
  business_id?: string;
}

export interface ApiNotification {
  id: number;
  user_id: string;
  business_id: string;
  event_id: number;
  channel: NotificationChannel;
  status: NotificationStatus;
  content: NotificationContent;
  retry_count: number;
  created_at: string;
  sent_at: string | null;
  read_at: string | null;
}

export interface NotificationsResponse {
  message: string;
  data: {
    notifications: ApiNotification[];
    unread_count: number;
    limit: number;
    offset: number;
  };
}

export interface UnreadCountResponse {
  message: string;
  data: {
    unread_count: number;
  };
}

// Notification Preferences Types
export interface NotificationPreferences {
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  messages_enabled: boolean;
  category_preferences: {
    announcements?: boolean;
    approvals?: boolean;
    insights?: boolean;
    payees?: boolean;
    payments?: boolean;
    rewards?: boolean;
    security?: boolean;
  };
  created_at: string;
  updated_at?: string;
}

export interface PreferencesResponse {
  message: string;
  data: NotificationPreferences;
}

// Frontend UI Type (transformed from API)
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
  actions?: ActionButton[];
  event_type?: string;
}
