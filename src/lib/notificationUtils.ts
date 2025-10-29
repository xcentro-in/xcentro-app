
import { ApiNotification, NotificationItem, NotificationCategory, NotificationPriority } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';

/**
 * Extract category from event_type (e.g., "payment.approval.required" -> "payment")
 */
export function extractCategoryFromEventType(eventType: string): NotificationCategory {
  const category = eventType.split('.')[0];

  // Map API categories to UI categories
  const categoryMap: Record<string, NotificationCategory> = {
    'payment': 'payment',
    'settlement': 'payment',
    'payee': 'payee',
    'payout': 'payment',
    'report': 'insights',
    'system': 'announcements',
    'user': 'security',
  };

  return categoryMap[category] || 'announcements';
}

/**
 * Determine notification priority based on event type
 */
export function determinePriority(eventType: string): NotificationPriority {
  // High priority events
  const highPriorityEvents = [
    'payment.failed',
    'payment.rejected',
    'settlement.failed',
    'payee.verification.failed',
    'payout.failed',
    'system.alert',
  ];

  // Medium priority events
  const mediumPriorityEvents = [
    'payment.approval.required',
    'system.maintenance',
    'user.role.changed',
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
  };

  return displayNames[category] || category;
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

