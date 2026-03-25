export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

// In-memory cache to strictly prevent duplicate identical requests to Nominatim
const geocodeCache: Record<string, GeocodeResult | null> = {};

// 100% Free, privacy-safe Geocoding via OpenStreetMap. No API keys.
// COMPLIANCE: This must ONLY be fired on explicit user action (e.g. Enter key), NEVER on typeahead.
export async function geocodeLocation(query: string): Promise<GeocodeResult | null> {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery || normalizedQuery.length < 3) return null;
  
  // Return cached result if available to protect provider
  if (geocodeCache[normalizedQuery] !== undefined) {
    return geocodeCache[normalizedQuery];
  }
  
  try {
    // Note: Browsers block custom User-Agent headers in fetch(). 
    // Nominatim relies on the Origin/Referer header natively sent by the browser.
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.append('format', 'json');
    url.searchParams.append('q', normalizedQuery);
    url.searchParams.append('limit', '1');

    const res = await fetch(url.toString(), {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    
    if (!res.ok) throw new Error(`Geocoding network error: ${res.status}`);
    
    const data = await res.json();
    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
      geocodeCache[normalizedQuery] = result;
      return result;
    } else {
      // Cache nulls to prevent identical empty searches from hitting API again
      geocodeCache[normalizedQuery] = null;
      return null;
    }
  } catch (error) {
    console.error("Geocoding retrieval failed:", error);
    // Do NOT cache network errors so the user can cleanly retry later
    throw error;
  }
}
