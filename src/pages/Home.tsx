import React, { useState, useMemo, useEffect } from 'react';
import { Loader2, LocateFixed } from 'lucide-react';
import MapHub from '../components/Map/MapHub';
import BottomSheet from '../components/BottomSheet/BottomSheet';
import AdZone from '../components/AdZone/AdZone';
import { mockPlaces } from '../data/mockPlaces';
import type { PlaceCategory, Place } from '../data/mockPlaces';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { geocodeLocation } from '../lib/geocoder';
import type { GeocodeResult } from '../lib/geocoder';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistance } from '../utils/haversine';
import './Home.css';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | 'all'>('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>(mockPlaces);
  const [isLoadingDB, setIsLoadingDB] = useState(isSupabaseConfigured());
  
  // Geocoding States
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number}>({lat: 39.7392, lng: -104.9903});
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Selection UX States
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Math & Device Telemetry
  const { location, geoError, isLocating, requestLocation, setGeoError } = useGeolocation();

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

  // Explicit Global Search Submit handler (Provider Compliant)
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query.length < 3) return;

    setSearchError(null);
    setShowDropdown(false);

    // 1. Direct Local Match Optimization
    const localMatch = places.find(p => p.name.toLowerCase().includes(query.toLowerCase()));
    if (localMatch) {
       setMapCenter({ lat: Number(localMatch.lat), lng: Number(localMatch.lng) });
       return;
    }

    // 2. Global API Search
    setIsGeocoding(true);
    try {
      const res = await geocodeLocation(query);
      if (res && res.length > 0) {
        if (res.length === 1) {
          // Jump immediately if only one true match globally exists
          setMapCenter({ lat: res[0].lat, lng: res[0].lng });
          setSearchQuery(res[0].displayName.split(',')[0]);
        } else {
          // Display the newly fetched options array for user selection
          setSearchResults(res);
          setShowDropdown(true);
        }
      } else {
        setSearchError('No places found. Try a different city.');
      }
    } catch (err) {
      setSearchError('Search service unavailable. Please try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSelectResult = (result: GeocodeResult) => {
    setMapCenter({ lat: result.lat, lng: result.lng });
    setSearchQuery(result.displayName.split(',')[0]); // Clean user query down to city name
    setShowDropdown(false);
  };

  const filteredPlaces = useMemo(() => {
    let currentPlaces = places;
    if (activeCategory !== 'all') {
      currentPlaces = currentPlaces.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      currentPlaces = currentPlaces.filter(p => p.name.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q)));
    }
    
    // Offline Haversine Sorting: Render exactly what is closest.
    if (location) {
      currentPlaces = [...currentPlaces].sort((a, b) => {
        const distA = calculateDistance(location.lat, location.lng, Number(a.lat), Number(a.lng));
        const distB = calculateDistance(location.lat, location.lng, Number(b.lat), Number(b.lng));
        return distA - distB;
      });
    }

    return currentPlaces;
  }, [activeCategory, searchQuery, places, location]);

  const selectedDistance = useMemo(() => {
    if (!selectedPlace || !location) return null;
    return calculateDistance(location.lat, location.lng, Number(selectedPlace.lat), Number(selectedPlace.lng));
  }, [selectedPlace, location]);

  return (
    <div className="home-container">
      <div className="map-placeholder" style={{ position: 'relative' }}>
        <MapHub 
          places={filteredPlaces} 
          centerLat={mapCenter.lat}
          centerLng={mapCenter.lng}
          onMarkerClick={setSelectedPlace} 
        />
        
        {/* Floating GeoLocation Button */}
        <button 
          className="glass shadow-sm" 
          aria-label="Use My Location"
          onClick={requestLocation}
          disabled={isLocating}
          style={{ 
            position: 'absolute', right: '1rem', bottom: '1.5rem', zIndex: 1000, 
            width: '44px', height: '44px', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            backgroundColor: location ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.85)', 
            color: location ? 'white' : 'var(--color-text)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            cursor: isLocating ? 'wait' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {isLocating ? <Loader2 className="spinner" size={20} /> : <LocateFixed size={20} />}
        </button>
      </div>
      
      {/* Floating Header Actions */}
      <header className="home-header" style={{ flexDirection: 'column' }}>
          <form className="search-container shadow-sm" style={{ position: 'relative' }} onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search places, cities..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (searchError) setSearchError(null); // Clear error on typing
              }}
              aria-label="Search places and events"
            />
            {isGeocoding ? (
              <Loader2 className="search-loader spinner" size={18} />
            ) : (
              <button type="submit" className="search-button" aria-label="Submit search">
                 <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Go</span>
              </button>
            )}
          </form>
          
          {showDropdown && searchResults.length > 0 && (
            <div className="search-dropdown slide-down shadow-sm glass">
              {searchResults.map((res, i) => (
                <div key={i} className="search-dropdown-item" onClick={() => handleSelectResult(res)}>
                  {res.displayName}
                </div>
              ))}
            </div>
          )}

          {searchError && (
            <div className="search-error-toast slide-down">
              {searchError}
            </div>
          )}

          {geoError && (
            <div className="search-error-toast slide-down" style={{ marginTop: '0.5rem', backgroundColor: '#fff3cd', color: '#856404', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{geoError}</span>
              <button onClick={() => setGeoError(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#856404' }}>×</button>
            </div>
          )}
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

      <BottomSheet place={selectedPlace} distance={selectedDistance} onClose={() => setSelectedPlace(null)} />
    </div>
  );
};

export default Home;
