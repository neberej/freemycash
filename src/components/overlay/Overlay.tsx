import React from 'react';
import './Overlay.scss';

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="button close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Overlay;