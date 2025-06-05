import React from 'react';
import Overlay from '@src/components/overlay/Overlay';
import messages from '@src/static/messages.json';
import './ConfirmDelete.scss';

interface ConfirmDeleteProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ onConfirm, onCancel }) => {
  return (
    <Overlay isOpen={true} onClose={onCancel}>
      <div className="confirm-delete">
        <h3>{messages.transactions.deleteConfirmTitle}</h3>
        <p>{messages.transactions.deleteConfirmMessage}</p>
        <div className="confirm-delete-actions">
          <button className="button button-confirm" onClick={onConfirm}>
            {messages.buttons.delete || 'Delete'}
          </button>
          <button className="button button-cancel" onClick={onCancel}>
            {messages.buttons.cancel || 'Cancel'}
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default ConfirmDelete;