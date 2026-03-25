import { useState, useCallback } from 'react';

export interface GeoLocation {
  lat: number;
  lng: number;
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not mathematically supported by this browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        switch(err.code) {
          case err.PERMISSION_DENIED:
            setGeoError('Location permission securely denied. Defaulting to manual search.');
            break;
          case err.POSITION_UNAVAILABLE:
            setGeoError('Hardware location telemetry currently unavailable.');
            break;
          case err.TIMEOUT:
            setGeoError('The location telemetry request timed out.');
            break;
          default:
            setGeoError('An unknown GPS error securely occurred.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  return { location, geoError, isLocating, requestLocation, setGeoError };
}
