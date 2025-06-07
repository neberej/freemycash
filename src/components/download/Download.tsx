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
    if (!data) {
      addNotification('No data to download', 'error');
      return;
    }

    try {
      const today = getCurrentDateISO();
      const filename = data.prefixDownload ? `finance-data-${today}.json` : 'finance-data.json';
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;

      // Append to DOM before clicking (required for iOS Safari)
      document.body.appendChild(a);

      // Slight delay to ensure DOM readiness and gesture handling
      setTimeout(() => {
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setIsModified(false);
        addNotification('Data downloaded successfully', 'success');
      }, 0);
    } catch (error) {
      console.error('Download failed:', error);
      addNotification('Failed to download data', 'error');
    }
  };


  return (
    <>
      <button className="button transparent" onClick={handleDownload} disabled={!data}>
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