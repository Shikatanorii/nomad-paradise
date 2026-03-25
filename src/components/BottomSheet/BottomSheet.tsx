import { Navigation, Phone, Globe, Bookmark, X, Star } from 'lucide-react';
import type { Place } from '../../data/mockPlaces';
import './BottomSheet.css';

interface BottomSheetProps {
  place: Place | null;
  distance?: number | null;
  onClose: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ place, distance, onClose }) => {
  if (!place) return null;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

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
        
        {distance !== undefined && distance !== null && place.category !== 'event' && (
          <div className="place-distance slide-down" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Navigation size={14} /> Approx. {distance.toFixed(1)} miles (straight-line)
          </div>
        )}
        
        {place.category === 'event' && place.date && (
          <div className="place-distance slide-down" style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            📅 {place.date}
          </div>
        )}
        
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
          {place.category === 'event' && place.externalUrl ? (
            <a href={place.externalUrl} target="_blank" rel="noopener noreferrer" className="action-btn primary" style={{ textDecoration: 'none', background: 'var(--color-warning)', color: 'var(--color-primary-dark)' }}>
              <Globe size={20} />
              <span>Tickets / Info</span>
            </a>
          ) : (
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="action-btn primary" style={{ textDecoration: 'none' }}>
              <Navigation size={20} />
              <span>Directions</span>
            </a>
          )}
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
