import React, { useState } from 'react';
import messages from '@src/static/messages.json';
import { useStore } from '@src/store/useStore';
import Notification from '@src/components/notification/Notification';
import Tooltip from '@src/components/tooltip/Tooltip';
import { Notification as NotificationType } from '@src/types';
import { saveToLocalStorage } from '@src/utils/saveData';
import './Settings.scss';

const Settings: React.FC = () => {
  const { data, setData } = useStore();

  const [categoriesInput, setCategoriesInput] = useState(data?.categories.join(', ') || '');
  const [readApi, setReadApi] = useState(data?.externalApi?.read || '');
  const [writeApi, setWriteApi] = useState(data?.externalApi?.write || '');
  const [prefixDownload, setPrefixDownload] = useState(data?.prefixDownload || false);
  const [saveInBrowser, setSaveInBrowser] = useState(data?.saveInBrowser || false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = (message: string, type: NotificationType['type']) => {
    setNotifications([...notifications, { id: Date.now().toString(), message, type }]);
  };

  const handleSave = () => {
    if (!data) return;

    const newCategories = categoriesInput
      .split(',')
      .map((cat) => cat.trim())
      .filter((cat) => cat);

    const updatedData = {
      ...data,
      categories: newCategories,
      prefixDownload,
      saveInBrowser,
      externalApi: { read: readApi, write: writeApi },
    };

    setData(updatedData);

    if (saveInBrowser) {
      saveToLocalStorage(updatedData);
      addNotification('Settings saved successfully', 'success');
    } else {
      localStorage.removeItem('financialData');
      addNotification('Settings saved and local storage cleared', 'success');
    }
  };

  return (
    <div className="container settings">
      <h3>{messages.settings.title}</h3>
      <div className="container-inner">
        <div className="settings-option">
          <label>
            <input
              type="checkbox"
              checked={prefixDownload}
              onChange={(e) => setPrefixDownload(e.target.checked)}
            />
            {messages.settings.prefixDate}
            <Tooltip tooltip={messages.settings.prefixTooltip} className="settings-tooltips" />
          </label>
        </div>
        <div className="settings-option warning">
          <label>
            <input
              type="checkbox"
              checked={saveInBrowser}
              onChange={(e) => setSaveInBrowser(e.target.checked)}
            />
            {messages.settings.saveInBrowser}
            <Tooltip tooltip={messages.settings.saveInBrowserTooltip} className="settings-tooltips" />
          </label>
        </div>
        <div className="settings-option">
          <label>
            {messages.settings.categories}
            <input
              className="input2"
              type="text"
              value={categoriesInput}
              onChange={(e) => setCategoriesInput(e.target.value)}
              placeholder="Comma-separated categories"
            />
          </label>
        </div>
        <div className="settings-option">
          <label>
            {messages.settings.backendApi}
            <input
              className="input2"
              type="text"
              value={readApi}
              onChange={(e) => setReadApi(e.target.value)}
              placeholder="/read"
            />
          </label>
        </div>
        <div className="settings-option">
          <label>
            <input
              className="input2"
              type="text"
              value={writeApi}
              onChange={(e) => setWriteApi(e.target.value)}
              placeholder="/write"
            />
          </label>
        </div>
        <button className="button" onClick={handleSave}>{messages.buttons.save}</button>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={() =>
              setNotifications(notifications.filter((n) => n.id !== notification.id))
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Settings;
