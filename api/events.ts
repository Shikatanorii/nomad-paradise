import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS compliance for local Vite iterations
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing lat or lng native bounding parameters.' });
  }

  // Pure Serverless ENV access guarantees zero Client leak
  const apiKey = process.env.TICKETMASTER_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing TICKETMASTER_API_KEY environment variable constraints. Vercel dashboard configuration required.' });
  }

  try {
    const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
    url.searchParams.append('apikey', apiKey as string);
    url.searchParams.append('latlong', `${lat},${lng}`);
    url.searchParams.append('radius', '30'); // 30 mile MVP constraints
    url.searchParams.append('unit', 'miles');
    url.searchParams.append('classificationName', 'Music,Comedy,Sports');
    url.searchParams.append('sort', 'date,asc');
    url.searchParams.append('size', '20'); // Throttle payload mass natively

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      console.error('Ticketmaster API Rejection:', data);
      return res.status(response.status).json({ error: 'Failed to negotiate structured event payload from provider.' });
    }

    // Explicitly command Vercel CDN to cache identical lat/lng queries for 1 Hour to shelter the 5-req/sec rate limits!
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    // Structurally sanitize the massive Ticketmaster graph into our microscopic Place interface
    const events = data._embedded?.events || [];
    
    const processedEvents = events.map((e: any) => {
      const location = e._embedded?.venues?.[0]?.location;
      const address = e._embedded?.venues?.[0]?.address?.line1 || e._embedded?.venues?.[0]?.name || 'Local Venue Details TBA';
      const eventDate = e.dates?.start?.localDate;
      const eventTime = e.dates?.start?.localTime || '';
      
      const displayDate = eventDate ? `${eventDate} ${eventTime}`.trim() : 'Date TBA';

      return {
        id: `event_${e.id}`,
        name: e.name,
        category: 'event', // Force map to natively render as Event category
        lat: location ? parseFloat(location.latitude) : 0,
        lng: location ? parseFloat(location.longitude) : 0,
        address: address,
        tags: [e.classifications?.[0]?.segment?.name || 'Live Event', 'Ticketmaster'], // Guarantee Tag intersection honesty
        externalUrl: e.url, // Native external routing bypassing internal coordinates
        date: displayDate
      };
    }).filter((e: any) => e.lat !== 0 && e.lng !== 0); // Drop corrupt coordinate nodes natively

    return res.status(200).json({ events: processedEvents });

  } catch (error) {
    console.error('Node Proxy Catastrophe:', error);
    return res.status(500).json({ error: 'Internal Serverless Exception during third-party provider extraction.' });
  }
}
