
import { useState, useCallback, useRef } from 'react';
import { NotificationItem, NotificationsResponse } from '@/types/notification';
import { notificationsAPI } from '@/services/api';
import { transformApiNotifications } from '@/lib/notificationUtils';
import { useToast } from '@/hooks/use-toast';

const CACHE_DURATION = 10000; // 10 seconds

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const lastFetchTimeRef = useRef<number>(0);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (force: boolean = false) => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;

    // If we fetched within the last 10 seconds and it's not forced, skip
    if (!force && timeSinceLastFetch < CACHE_DURATION) {
      console.log('Using cached notifications (fetched', timeSinceLastFetch, 'ms ago)');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await notificationsAPI.getAll({ limit: 100 }) as NotificationsResponse;

      // Handle case where response or response.data might be null/undefined
      const { transformedNotifications, transformedUnreadCount } = transformApiNotifications(response?.data || null);
      setNotifications(transformedNotifications);
      setUnreadCount(transformedUnreadCount);
      lastFetchTimeRef.current = now;
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications');
      // Set empty notifications on error to prevent UI crashes
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
    }
  }, []);

  const openNotifications = useCallback(async () => {
    setIsOpen(true);
    // Fetch notifications when opening, respecting the cache window
    await fetchNotifications();
  }, [fetchNotifications]);

  const closeNotifications = useCallback(() => {
    setIsOpen(false);
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      // Optimistic update
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Call API
      await notificationsAPI.markAsRead(parseInt(id));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);

      // Revert optimistic update on error
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, read: false }
            : notification
        )
      );
      setUnreadCount(prev => prev + 1);

      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => parseInt(n.id));

      if (unreadIds.length === 0) return;

      // Optimistic update
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);

      // Call API
      await notificationsAPI.markMultipleAsRead(unreadIds);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);

      // Revert on error - force refetch to get correct state
      await fetchNotifications(true);

      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  }, [notifications, fetchNotifications, toast]);

  const dismissNotification = useCallback((id: string) => {
    // For now, just mark as read and hide from UI
    // Backend might add a dismiss/archive endpoint later
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
        markAsRead(id); // Also mark as read in backend
      }
      return prev.filter(notification => notification.id !== id);
    });
  }, [markAsRead]);

  return {
    notifications,
    unreadCount,
    isOpen,
    isLoading,
    error,
    openNotifications,
    closeNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  };
};
