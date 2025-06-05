import React, { useRef } from 'react';
import './Overlay.scss';

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={handleBackdropClick}>
      <div className="overlay-content" ref={contentRef}>
        <button className="button close" onClick={onClose} aria-label="Close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Overlay;
