
import { ApiNotification, NotificationItem, NotificationCategory, NotificationPriority } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';

/**
 * Extract category from event_type (e.g., "payments.approval.required" -> "payments")
 * All event types follow the format: category.action.details
 *
 * Valid categories: announcements, rewards, payments, payees, approvals, security, insights
 * Unknown categories will be mapped to 'others'
 */
export function extractCategoryFromEventType(eventType: string): NotificationCategory {
  const category = eventType.split('.')[0];

  // Map API categories to UI categories
  // Backend categories match UI categories directly now
  const categoryMap: Record<string, NotificationCategory> = {
    'payments': 'payment',
    'payees': 'payee',
    'approvals': 'approvals',
    'security': 'security',
    'insights': 'insights',
    'announcements': 'announcements',
    'rewards': 'rewards',
  };

  // Return 'others' for any unmatched category
  return categoryMap[category] || 'others';
}

/**
 * Determine notification priority based on event type
 * Event types follow format: category.action.details
 */
export function determinePriority(eventType: string): NotificationPriority {
  // High priority events
  const highPriorityEvents = [
    'payments.failed',
    'payments.rejected',
    'payments.settlement.failed',
    'payments.payout.failed',
    'payees.verification.failed',
    'announcements.alert',
    'security.',  // All security events are important
  ];

  // Medium priority events
  const mediumPriorityEvents = [
    'payments.approval.required',
    'approvals.',  // Most approval events are medium priority
    'announcements.maintenance',
    'insights.report.ready',
  ];

  if (highPriorityEvents.some(event => eventType.includes(event))) {
    return 'high';
  }

  if (mediumPriorityEvents.some(event => eventType.includes(event))) {
    return 'medium';
  }

  return 'low';
}

/**
 * Transform API notification to UI notification format
 */
export function transformApiNotification(apiNotification: ApiNotification): NotificationItem {
  const { id, content, created_at, read_at } = apiNotification;

  const category = extractCategoryFromEventType(content.event_type);
  const priority = determinePriority(content.event_type);

  // Format time relative to now
  const time = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  // Get primary action if available
  const primaryAction = content.actions?.[0];

  return {
    id: id.toString(),
    title: content.title,
    message: content.body,
    time,
    read: !!read_at,
    category,
    priority,
    actionUrl: primaryAction?.href,
    actionLabel: primaryAction?.text,
    actions: content.actions,
    event_type: content.event_type,
  };
}

/**
 * Transform array of API notifications to UI format
 */
export function transformApiNotifications(data: { notifications: ApiNotification[] | null, unread_count: number | null } | null): { transformedNotifications: NotificationItem[], transformedUnreadCount: number } {
  // Handle null data or null notifications array
  if (!data || !data.notifications) {
    return { transformedNotifications: [], transformedUnreadCount: 0 };
  }

  const transformedNotifications = data.notifications.map(transformApiNotification);
  const transformedUnreadCount = data.unread_count || 0;
  return { transformedNotifications, transformedUnreadCount };
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: NotificationCategory): string {
  const displayNames: Record<NotificationCategory, string> = {
    'payment': 'Payments',
    'settlement': 'Settlements',
    'payee': 'Payees',
    'payout': 'Payouts',
    'report': 'Reports',
    'system': 'System',
    'user': 'User',
    'announcements': 'Announcements',
    'rewards': 'Rewards',
    'approvals': 'Approvals',
    'security': 'Security',
    'insights': 'Insights',
    'others': 'Others',
  };

  return displayNames[category] || 'Others';
}

/**
 * Get button style class based on button type
 */
export function getButtonStyleClass(buttonType: string): string {
  const buttonStyles: Record<string, string> = {
    'button-positive': 'bg-green-600 hover:bg-green-700 text-white',
    'button-negative': 'bg-red-600 hover:bg-red-700 text-white',
    'button-neutral': 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    'link': 'text-blue-600 hover:text-blue-700 underline',
  };

  return buttonStyles[buttonType] || buttonStyles['button-neutral'];
}

