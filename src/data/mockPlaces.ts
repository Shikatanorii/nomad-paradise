export type PlaceCategory = 'sleep' | 'food' | 'wash' | 'work' | 'event' | 'safety';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  rating?: number;
  reviews?: number;
  address: string;
  tags?: string[];
  externalUrl?: string; // Bounding native event URLs bypassing map routes
  date?: string; // Structured absolute timeline metric
}

export const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Rest Stop 44 - Overnight OK',
    category: 'sleep',
    lat: 39.7392,
    lng: -104.9903,
    rating: 4.2,
    reviews: 128,
    address: 'I-70, Exit 212',
    tags: ['Safe Overnight', 'Bathrooms', '24/7']
  },
  {
    id: '2',
    name: "Nomad Cafe & Co-work",
    category: 'work',
    lat: 39.7420,
    lng: -104.9915,
    rating: 4.8,
    reviews: 340,
    address: '123 Main St, Denver, CO',
    tags: ['Fast Wi-Fi', 'Outlets', 'Great Coffee']
  },
  {
    id: '3',
    name: "City Rec Center Showers",
    category: 'wash',
    lat: 39.7350,
    lng: -104.9850,
    rating: 4.0,
    reviews: 45,
    address: '456 East Ave, Denver, CO',
    tags: ['$5 Day Pass', 'Hot Showers', 'Gym']
  },
  {
    id: '4',
    name: "Sunset Ridge Dispersed Camping",
    category: 'sleep',
    lat: 39.6992,
    lng: -105.0203,
    rating: 4.9,
    reviews: 210,
    address: 'Forest Road 112',
    tags: ['Free', 'Beautiful Views', 'Uneven Road']
  },
  {
    id: '5',
    name: "Downtown Food Truck Rally",
    category: 'event',
    lat: 39.7482,
    lng: -104.9953,
    rating: 4.7,
    reviews: 88,
    address: 'Civic Center Park',
    tags: ['Live Music', 'Cheap Eats', 'Ends 10PM']
  }
];
