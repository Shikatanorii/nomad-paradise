import { Navigation, Phone, Globe, Bookmark, X, Star } from 'lucide-react';
import type { Place } from '../../data/mockPlaces';
import './BottomSheet.css';

interface BottomSheetProps {
  place: Place | null;
  onClose: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ place, onClose }) => {
  if (!place) return null;

  return (
    <div className="bottom-sheet glass shadow-lg slide-up">
      <div className="sheet-header">
        <div className="drag-handle" onClick={onClose}></div>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      
      <div className="sheet-content">
        <div className="sheet-title-row">
          <h2 className="place-title">{place.name}</h2>
          {place.rating && (
            <div className="place-rating">
              <Star size={16} className="star-icon" fill="currentColor" />
              <span>{place.rating}</span>
              <span className="reviews">({place.reviews})</span>
            </div>
          )}
        </div>
        
        <p className="place-address">{place.address}</p>
        
        <div className="place-tags">
          {place.tags?.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        {place.category === 'sleep' && (
          <div className="safety-disclaimer">
            <strong>⚠️ Safety Notice:</strong> 
            This app highlights potential spots based on community data. 
            Always verify local legality, signage, safety, and business policies before parking overnight.
          </div>
        )}
        
        <div className="action-grid">
          <button className="action-btn primary">
            <Navigation size={20} />
            <span>Directions</span>
          </button>
          <button className="action-btn secondary">
            <Bookmark size={20} />
            <span>Save</span>
          </button>
          <button className="action-btn secondary">
            <Globe size={20} />
            <span>Website</span>
          </button>
          <button className="action-btn secondary">
            <Phone size={20} />
            <span>Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
