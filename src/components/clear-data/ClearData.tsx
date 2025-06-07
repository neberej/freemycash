import React, { useState, useContext } from 'react';
import messages from '@src/static/messages.json';
import Overlay from '@src/components/overlay/Overlay';
import Notification from '@src/components/notification/Notification';
import { useStore } from '@src/store/useStore';
import { Notification as NotificationType } from '@src/types';
import { FiTrash2 } from 'react-icons/fi';
import './ClearData.scss';

const ClearData: React.FC = () => {
  const { data, setData, setIsModified, setIsDemo } = useStore();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = (message: string, type: NotificationType['type']) => {
    setNotifications([...notifications, { id: Date.now().toString(), message, type }]);
  };

  const handleClear = () => {
    setData(null);
    localStorage.removeItem('financialData');
    setIsModified(false);
    setIsDemo(false);
    setShowClearDialog(false);
    addNotification('Data cleared successfully', 'success');
  };

  return (
    <>
      <button className="button transparent"  disabled={!data} onClick={() => setShowClearDialog(true)}><FiTrash2/><span className="visually-hidden">{messages.header.clear}</span></button>
      <Overlay isOpen={showClearDialog} onClose={() => setShowClearDialog(false)}>
        <h2>{messages.clearDialog.title}</h2>
        <p>{messages.clearDialog.message}</p>
        <button className="button" onClick={handleClear}>{messages.clearDialog.confirm}</button>
      </Overlay>
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

export default ClearData;