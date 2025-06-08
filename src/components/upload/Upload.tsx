import React, { useState, useRef, useContext } from 'react';
import messages from '@src/static/messages.json';
import Overlay from '@src/components/overlay/Overlay';
import Notification from '@src/components/notification/Notification';
import { useStore } from '@src/store/useStore';
import { FinancialData, Notification as NotificationType } from '@src/types';
import { saveToLocalStorage } from '@src/utils/saveData';
import './Upload.scss';

const Upload: React.FC = () => {
  const { setData, isModified, setIsModified } = useStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addNotification = (message: string, type: NotificationType['type']) => {
    setNotifications([...notifications, { id: Date.now().toString(), message, type }]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      addNotification(messages.errors.invalidFileType, 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addNotification(messages.errors.fileTooLarge, 'error');
      return;
    }

    if (isModified) {
      setPendingFile(file);
      setShowConfirmDialog(true);
    } else {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData: FinancialData = JSON.parse(event.target?.result as string);
        setData(jsonData);
        if (jsonData.saveInBrowser) {
          saveToLocalStorage(jsonData);
        }
        setIsModified(false);
        addNotification('File uploaded successfully', 'success');
      } catch (error) {
        addNotification(messages.errors.invalidData, 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmUpload = () => {
    if (pendingFile) {
      processFile(pendingFile);
      setPendingFile(null);
    }
    setShowConfirmDialog(false);
  };

  return (
    <main className="main-content">
      <div className="container upload">
        <h2>{messages.header.upload}</h2>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        <Overlay isOpen={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
          <h2>{messages.uploadDialog.title}</h2>
          <p>{messages.uploadDialog.message}</p>
          <button className="button" onClick={handleConfirmUpload}>{messages.uploadDialog.confirm}</button>
          <button className="button" onClick={() => setShowConfirmDialog(false)}>{messages.uploadDialog.cancel}</button>
        </Overlay>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={() => setNotifications(notifications.filter((n) => n.id !== notification.id))}
          />
        ))}
      </div>
    </main>
  );
};

export default Upload;