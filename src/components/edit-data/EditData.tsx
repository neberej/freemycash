import React, { useState, useContext } from 'react';
import messages from '@src/static/messages.json';
import Notification from '@src/components/notification/Notification';
import { useStore } from '@src/store/useStore';
import { FinancialData, Notification as NotificationType } from '@src/types';
import { validateAndSaveData } from '@src/utils/dataManager';
import './EditData.scss';

const EditData: React.FC = () => {
  const { data, setData, setIsModified } = useStore();
  const [jsonInput, setJsonInput] = useState(data ? JSON.stringify(data, null, 2) : '');
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = (message: string, type: NotificationType['type']) => {
    setNotifications([...notifications, { id: Date.now().toString(), message, type }]);
  };

  const handleSave = () => {
    try {
      const { data: updatedData, notification } = validateAndSaveData(jsonInput, data?.saveInBrowser ?? false);
      setData(updatedData);
      setIsModified(true);
      addNotification(notification.message, notification.type);
    } catch (error) {
      addNotification(messages.errors.invalidData, 'error');
    }
  };

  return (
    <div className="edit-data">
      <h2>{messages.editData.title}</h2>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows={20}
        placeholder="Edit JSON data here"
      />
      <button className="button" onClick={handleSave}>{messages.buttons.save}</button>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => setNotifications(notifications.filter((n) => n.id !== notification.id))}
        />
      ))}
    </div>
  );
};

export default EditData;