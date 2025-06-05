import React, { useEffect } from 'react';
import './Notification.scss';
import { Notification as NotificationType } from '@src/types';

interface NotificationProps {
  notification: NotificationType;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification notification-${notification.type}`}>
      {notification.message}
    </div>
  );
};

export default Notification;