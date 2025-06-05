import React, { useContext, useState } from 'react';
import messages from '@src/static/messages.json';
import Notification from '@src/components/notification/Notification';
import { useStore } from '@src/store/useStore';
import { Notification as NotificationType } from '@src/types';
import { FiDownload } from 'react-icons/fi';
import { getCurrentDateISO } from '@src/utils/dateAndTime';
import './Download.scss';

const Download: React.FC = () => {
  const { data, setIsModified } = useStore();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = (message: string, type: NotificationType['type']) => {
    setNotifications([...notifications, { id: Date.now().toString(), message, type }]);
  };

  const handleDownload = () => {
    if (!data) return;
    const today = getCurrentDateISO();
    const filename = data.prefixDownload ? `finance-data-${today}.json` : 'finance-data.json';
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setIsModified(false);
    addNotification('Data downloaded successfully', 'success');
  };

  return (
    <>
      <button className="button" onClick={handleDownload} disabled={!data}>
        <FiDownload/>
        <span className="visually-hidden">{messages.header.download}</span>
      </button>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => setNotifications(notifications.filter((n) => n.id !== notification.id))}
        />
      ))}
    </>
  );
};

export default Download;