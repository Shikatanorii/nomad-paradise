import React, { useState, useMemo } from 'react';
import MapHub from '../components/Map/MapHub';
import BottomSheet from '../components/BottomSheet/BottomSheet';
import AdZone from '../components/AdZone/AdZone';
import { mockPlaces } from '../data/mockPlaces';
import type { PlaceCategory, Place } from '../data/mockPlaces';
import './Home.css';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | 'all'>('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = useMemo(() => {
    let places = mockPlaces;
    if (activeCategory !== 'all') {
      places = places.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      places = places.filter(p => p.name.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q)));
    }
    return places;
  }, [activeCategory, searchQuery]);

  return (
    <div className="home-container">
      <div className="map-placeholder">
        <MapHub 
          places={filteredPlaces} 
          onMarkerClick={selectedPlace => setSelectedPlace(selectedPlace)} 
        />
      </div>
      
      {/* Floating Header Actions */}
      <header className="home-header">
        <div className="search-bar shadow-sm glass">
          <input 
            type="text" 
            placeholder="Search places, events..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search places and events"
          />
        </div>
      </header>

      {/* Honest Mock Data Banner */}
      <div className="mock-banner shadow-sm slide-down">
        <span>Demo Build: Displaying Sample Data</span>
        <a href="/legal" className="legal-link">Legal / Disclaimers</a>
      </div>

      {/* Filter Pills */}
      <div className="filter-container" role="tablist" aria-label="Filter Map Categories">
        <button 
          role="tab"
          aria-selected={activeCategory === 'all'}
          className={`filter-pill shadow-sm glass ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        <button 
          role="tab"
          aria-selected={activeCategory === 'sleep'}
          className={`filter-pill shadow-sm glass ${activeCategory === 'sleep' ? 'active' : ''}`}
          onClick={() => setActiveCategory('sleep')}
        >
          Sleep Tonight
        </button>
        <button 
          role="tab"
          aria-selected={activeCategory === 'wash'}
          className={`filter-pill shadow-sm glass ${activeCategory === 'wash' ? 'active' : ''}`}
          onClick={() => setActiveCategory('wash')}
        >
          Showers
        </button>
        <button 
          role="tab"
          aria-selected={activeCategory === 'food'}
          className={`filter-pill shadow-sm glass ${activeCategory === 'food' ? 'active' : ''}`}
          onClick={() => setActiveCategory('food')}
        >
          Food
        </button>
        <button 
          role="tab"
          aria-selected={activeCategory === 'work'}
          className={`filter-pill shadow-sm glass ${activeCategory === 'work' ? 'active' : ''}`}
          onClick={() => setActiveCategory('work')}
        >
          Work
        </button>
        <button 
          role="tab"
          aria-selected={activeCategory === 'event'}
          className={`filter-pill shadow-sm glass ${activeCategory === 'event' ? 'active' : ''}`}
          onClick={() => setActiveCategory('event')}
        >
          Events
        </button>
      </div>

      <div className="ad-container" style={{ position: 'absolute', bottom: '80px', width: '100%', zIndex: 1000 }}>
        <AdZone type="banner-bottom" />
      </div>

      <BottomSheet place={selectedPlace} onClose={() => setSelectedPlace(null)} />
    </div>
  );
};

export default Home;
