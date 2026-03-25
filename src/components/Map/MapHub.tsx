import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Place } from '../../data/mockPlaces';
import './MapHub.css';

// Fix Leaflet's default icon path issues in React
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface MapHubProps {
  places: Place[];
  centerLat?: number;
  centerLng?: number;
  onMarkerClick?: (place: Place) => void;
}

// Custom component to handle dynamic repositioning later
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const MapHub: React.FC<MapHubProps> = ({ 
  places, 
  centerLat = 39.7392, 
  centerLng = -104.9903,
  onMarkerClick
}) => {
  return (
    <div className="map-hub-container">
      <MapContainer 
        center={[centerLat, centerLng]} 
        zoom={13} 
        scrollWheelZoom={true}
        zoomControl={false} /* We will add custom position for zoom control if needed */
        className="leaflet-map"
      >
        <MapController center={[centerLat, centerLng]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        {places.map((place) => (
          <Marker 
            key={place.id} 
            position={[place.lat, place.lng]}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(place)
            }}
          >
            <Popup className="custom-popup">
              <div className="popup-content">
                <strong>{place.name}</strong>
                <span>{place.tags?.[0]}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapHub;
