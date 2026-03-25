/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * utilizing the standard mathematical Haversine formula natively.
 * 
 * Performance: $0 Cost, Offline-capable, 0 Third-Party dependencies.
 * Returns geographical distance stringently bound to US Miles.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of the Earth locally bounded in miles
  const rLat1 = (Math.PI / 180) * lat1;
  const rLat2 = (Math.PI / 180) * lat2;
  const dLat = rLat2 - rLat1;
  const dLon = (Math.PI / 180) * (lon2 - lon1);

  const a = Math.pow(Math.sin(dLat / 2), 2) +
            Math.pow(Math.sin(dLon / 2), 2) * Math.cos(rLat1) * Math.cos(rLat2);
  
  const c = 2 * Math.asin(Math.sqrt(a));
  
  // Return precisely computed distance
  return R * c;
}
