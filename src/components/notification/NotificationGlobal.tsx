import React, { useEffect } from 'react';
import { useStore } from '@src/store/useStore';
import Notification from './Notification';
import { Notification as NotificationType } from '@src/types';

const NotificationGlobal: React.FC = () => {
  const notification = useStore((state) => state.notification);
  const setNotification = useStore((state) => state.setNotification);

  const onClose = () => setNotification(null);

  const notificationData: NotificationType = {
    message: notification?.message || 'Unknown error',
    id: Date.now().toString(),
    type: notification?.type || 'info'
  }

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification, setNotification]);

  if (!notification) return null;

  return <Notification notification={notificationData} onClose={onClose} />;
};

export default NotificationGlobal;
