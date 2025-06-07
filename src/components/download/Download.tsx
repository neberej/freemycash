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
    const jsonStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonStr);

    const a = document.createElement('a');
    a.href = dataUri;
    a.download = filename;

    // On iOS, must be triggered directly inside user gesture (like onClick)
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setIsModified(false);
    addNotification('Data downloaded successfully', 'success');
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