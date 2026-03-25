export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

// In-memory cache to strictly prevent duplicate identical requests to Nominatim
const geocodeCache: Record<string, GeocodeResult[] | null> = {};

// 100% Free, privacy-safe Geocoding via OpenStreetMap. No API keys.
// COMPLIANCE: This must ONLY be fired on explicit user action (e.g. Enter key), NEVER on typeahead.
export async function geocodeLocation(query: string): Promise<GeocodeResult[] | null> {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery || normalizedQuery.length < 3) return null;
  
  // Return cached result if available to protect provider
  if (geocodeCache[normalizedQuery] !== undefined) {
    return geocodeCache[normalizedQuery];
  }
  
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.append('format', 'json');
    url.searchParams.append('q', normalizedQuery);
    url.searchParams.append('limit', '5'); // Broadened to support Patch 1.3 selection UX

    const res = await fetch(url.toString(), {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    
    if (!res.ok) throw new Error(`Geocoding network error: ${res.status}`);
    
    const data = await res.json();
    if (data && data.length > 0) {
      const results = data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name
      }));
      geocodeCache[normalizedQuery] = results;
      return results;
    } else {
      geocodeCache[normalizedQuery] = null;
      return null;
    }
  } catch (error) {
    console.error("Geocoding retrieval failed:", error);
    throw error;
  }
}
