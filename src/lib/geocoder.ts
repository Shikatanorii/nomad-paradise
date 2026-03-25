export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

// 100% Free, privacy-safe Geocoding via OpenStreetMap. No API keys.
export async function geocodeLocation(query: string): Promise<GeocodeResult | null> {
  if (!query || query.trim().length < 3) return null;
  
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&limit=1`, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'NomadParadise/1.1 (nomad-paradise.vercel.app)'
      }
    });
    
    if (!res.ok) throw new Error('Geocoding network error');
    
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
  } catch (error) {
    console.error("Geocoding retrieval failed:", error);
  }
  return null;
}
