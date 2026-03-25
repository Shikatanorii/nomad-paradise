import React, { useState, useMemo, useEffect } from 'react';
import MapHub from '../components/Map/MapHub';
import BottomSheet from '../components/BottomSheet/BottomSheet';
import AdZone from '../components/AdZone/AdZone';
import { mockPlaces } from '../data/mockPlaces';
import type { PlaceCategory, Place } from '../data/mockPlaces';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import './Home.css';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | 'all'>('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>(mockPlaces);
  const [isLoadingDB, setIsLoadingDB] = useState(isSupabaseConfigured());

  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      const fetchPlaces = async () => {
        try {
          const { data, error } = await supabase!.from('places').select('*');
          if (error) throw error;
          if (data && data.length > 0) {
            setPlaces(data as unknown as Place[]);
          }
        } catch (err) {
          console.error("Supabase fetch failed, falling back to mock:", err);
          setPlaces(mockPlaces);
        } finally {
          setIsLoadingDB(false);
        }
      };
      fetchPlaces();
    }
  }, []);

  const filteredPlaces = useMemo(() => {
    let currentPlaces = places;
    if (activeCategory !== 'all') {
      currentPlaces = currentPlaces.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      currentPlaces = currentPlaces.filter(p => p.name.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q)));
    }
    return currentPlaces;
  }, [activeCategory, searchQuery, places]);

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

      {/* Premium Data Status Pill */}
      <div className="data-status-pill slide-down">
        <div className={`status-dot ${isSupabaseConfigured() ? 'live' : 'mock'}`} />
        <span className="status-text">
          {isLoadingDB ? 'Connecting...' : isSupabaseConfigured() ? 'Live Network' : 'Demo Mode'}
        </span>
        <div className="status-divider" />
        <a href="/legal" className="status-link">Safety & Legal</a>
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
