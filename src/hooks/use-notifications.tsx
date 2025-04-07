
import { useState, useCallback } from 'react';
import { mockNotifications } from '@/data/mockNotifications';
import { NotificationItem } from '@/types/notification';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(
    mockNotifications.filter(n => !n.read).length
  );

  const openNotifications = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeNotifications = useCallback(() => {
    setIsOpen(false);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(notification => notification.id !== id);
    });
  }, []);

  return {
    notifications,
    unreadCount,
    isOpen,
    openNotifications,
    closeNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification
  };
};
