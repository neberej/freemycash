import React, { useEffect, useState } from 'react';
import { useStore } from '@src/store/useStore';
import messages from '@src/static/messages.json';
import Notification from '@src/components/notification/Notification';
import Overlay from '@src/components/overlay/Overlay';
import { validateAndSaveData } from '@src/utils/dataManager';
import { Notification as NotificationType } from '@src/types';
import './EditData.scss';

const EditData: React.FC = () => {
  const { data, setData, setIsModified } = useStore();
  const [jsonInput, setJsonInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  // Load latest data when opening overlay
  useEffect(() => {
    if (isOpen && data) {
      setJsonInput(JSON.stringify(data, null, 2));
    }
  }, [isOpen, data]);

  const addNotification = (message: string, type: NotificationType['type']) => {
    setNotifications((prev) => [...prev, { id: Date.now().toString(), message, type }]);
  };

  const handleSave = () => {
    try {
      const { data: updatedData, notification } = validateAndSaveData(
        jsonInput,
        data?.saveInBrowser ?? false
      );
      setData(updatedData);
      setIsModified(true);
      console.log(notification)
      addNotification(notification.message, notification.type);
      setIsOpen(false);
    } catch (error) {
      addNotification(messages.errors.invalidData, 'error');
    }
  };

  return (
    <div className="edit-container">
      <h4>{messages.editData.editTitle}</h4>
      <p>{messages.editData.editDesc}</p>
      <button className="button edit-data-toggle" onClick={() => setIsOpen(true)}>
        {messages.editData.open}
      </button>
      <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="edit-raw-data">
          <h3>{messages.editData.overlayTitle}</h3>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={20}
            placeholder="Edit JSON data here"
          />
          <div className="edit-actions">
            <button className="button" onClick={handleSave}>
              {messages.buttons.save}
            </button>
            <button className="button dark" onClick={() => setIsOpen(false)}>
              {messages.buttons.cancel}
            </button>
          </div>
        </div>
      </Overlay>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() =>
            setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
          }
        />
      ))}
    </div>
  );
};

export default EditData;
