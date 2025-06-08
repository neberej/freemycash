import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import messages from '@src/static/messages.json';
import { useStore } from '@src/store/useStore';
import { FinancialData } from '@src/types';
import './WelcomeScreen.scss';

let uploadCounter = 0; // Counter for uploaded transaction IDs

const WelcomeScreen: React.FC = () => {
  const { setData, setIsModified } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert(messages.errors.invalidFileType);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData: FinancialData = JSON.parse(event.target?.result as string);
        const timestamp = Date.now();
        const updatedData = {
          ...jsonData,
          transactions: jsonData.transactions.map((t, index) => ({
            ...t,
            id: t.id || `t-${timestamp}-${uploadCounter++}`,
          })),
        };
        setData(updatedData);
        setIsModified(false);
        navigate('/overview');
      } catch (error) {
        alert(messages.errors.invalidData);
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="welcome-screen">
      <h2>{messages.WelcomeScreen.title}</h2>
      <p>{messages.WelcomeScreen.message}</p>
      <div className="welcome-actions">
        <button className="button" onClick={() => fileInputRef.current?.click()}>
          {messages.WelcomeScreen.upload}
        </button>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <button className="button" onClick={() => navigate('/create-new')}>{messages.WelcomeScreen.createNew}</button>
      </div>
      <p className="demo-link"><a href='?demo=true'>See the demo &gt;</a></p>
    </div>
  );
};

export default WelcomeScreen;