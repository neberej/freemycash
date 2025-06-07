import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import messages from '@src/static/messages.json';
import { useStore } from '@src/store/useStore';
import { FinancialData, Notification as NotificationType } from '@src/types';
import Notification from '@src/components/notification/Notification';
import Tooltip from '@src/components/tooltip/Tooltip';
import { saveToLocalStorage } from '@src/utils/saveData';
import './CreateNewFile.scss';

const defaultData: Partial<FinancialData> = {
  transactions: [],
  saveInBrowser: false,
  prefixDownload: true,
  currency: '$',
  categories: messages.categories
};

const CreateNewFile: React.FC = () => {
  const { setData, setIsModified } = useStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    saveInBrowser: defaultData.saveInBrowser!,
    prefixDownload: defaultData.prefixDownload!,
    categories: defaultData.categories!.join(', '),
  });
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = (message: string, type: NotificationType['type']) => {
    setNotifications([...notifications, { id: Date.now().toString(), message, type }]);
  };

  const handleSave = () => {
    try {
      const newCategories = formData.categories
        .split(',')
        .map((cat) => cat.trim())
        .filter((cat) => cat);
      if (newCategories.length === 0) {
        addNotification(messages.errors.invalidCategories, 'error');
        return;
      }

      const newFinancialData: FinancialData = {
        ...defaultData,
        saveInBrowser: formData.saveInBrowser,
        prefixDownload: formData.prefixDownload,
        categories: newCategories,
      } as FinancialData;

      setData(newFinancialData);
      setIsModified(true);
      if (formData.saveInBrowser) {
        saveToLocalStorage(newFinancialData);
      }
      addNotification(messages.createNewFile.success, 'success');
      navigate('/transactions');
    } catch (error) {
      console.error('Failed to create new file:', error);
      addNotification(messages.errors.createFileFailed, 'error');
    }
  };

  return (
    <div className="container create-new-file">
      <h3>{messages.createNewFile.title}</h3>
      <div className="container-inner createnew">
        <div className="form-option">
          <label>
            <input
              type="checkbox"
              checked={formData.saveInBrowser}
              onChange={(e) => setFormData({ ...formData, saveInBrowser: e.target.checked })}
            />
            {messages.settings.saveInBrowser}
            <Tooltip tooltip={messages.settings.saveInBrowserTooltip} className="form-tooltips warning" />
          </label>
        </div>
        <div className="form-option">
          <label>
            <input
              type="checkbox"
              checked={formData.prefixDownload}
              onChange={(e) => setFormData({ ...formData, prefixDownload: e.target.checked })}
            />
            {messages.settings.prefixDate}
            <Tooltip tooltip={messages.settings.prefixTooltip} className="form-tooltips" />
          </label>
        </div>
        <div className="form-option">
          <label>
            {messages.settings.categories}
            <input
              className="input2"
              type="text"
              value={formData.categories}
              onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
              placeholder="Comma-separated categories"
            />
          </label>
        </div>
        <p className="modify-later">Note: You can change these settings at any time.</p>
        <button className="button" onClick={handleSave}>
          {messages.createNewFile.create}
        </button>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={() => setNotifications(notifications.filter((n) => n.id !== notification.id))}
          />
        ))}
      </div>
    </div>
  );
};

export default CreateNewFile;