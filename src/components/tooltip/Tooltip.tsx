import React from 'react';
import './Tooltip.scss';

interface TooltipProps {
  label?: string;
  tooltip: string;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ label, tooltip, className = '' }) => {
  return (
    <div className={`tooltip-wrapper ${className}`}>
      {label && <span className="tooltip-label">{label}</span>}
      <span className="tooltip-icon">?</span>
      <div className="custom-tooltip">{tooltip}</div>
    </div>
  );
};

export default Tooltip;
