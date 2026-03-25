import { useState, useEffect, useRef } from 'react';
import type { Place } from '../data/mockPlaces';

export function useEvents(lat: number, lng: number, isActive: boolean) {
  const [events, setEvents] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cache physically protects Ticketmaster 5-req/sec rate limits dynamically across mapping arrays
  const cacheRef = useRef<Record<string, Place[]>>({});

  useEffect(() => {
    if (!isActive) {
      setEvents([]); // Instantly purge DOM events if filter un-toggled natively
      return;
    }

    if (lat === 0 && lng === 0) return; // Ignore null geometry initialization

    // Cache mathematically to 1 decimal place (~11km bounds) securely bridging 30-mile MVP API search radiuses 
    const cacheKey = `${lat.toFixed(1)},${lng.toFixed(1)}`;
    
    if (cacheRef.current[cacheKey]) {
      setEvents(cacheRef.current[cacheKey]);
      return;
    }

    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/events?lat=${lat}&lng=${lng}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to structurally resolve external event telemetry.');
        }

        cacheRef.current[cacheKey] = data.events;
        setEvents(data.events);
      } catch (err: any) {
        console.error('Event Hook Integrity Exception:', err);
        setError(err.message || 'Error locating native live network events.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [lat, lng, isActive]);

  return { events, isLoading, error };
}
