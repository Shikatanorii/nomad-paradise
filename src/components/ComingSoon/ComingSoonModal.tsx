import React from 'react';
import { X } from 'lucide-react';
import './ComingSoonModal.css';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  description?: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ 
  isOpen, 
  onClose, 
  featureName, 
  description = "We're currently polishing this feature to ensure it's genuinely helpful for your travels." 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content shadow-lg slide-up" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <div className="modal-header">
          <span className="modal-badge">Version 1.1 Preview</span>
          <h2 id="modal-title" className="modal-title">{featureName}</h2>
        </div>
        <p className="modal-body">{description}</p>
        <p className="modal-footer-note">This is a planned feature on our roadmap. Stay tuned!</p>
        <button className="btn-primary" onClick={onClose}>Understood</button>
      </div>
    </div>
  );
};

export default ComingSoonModal;
