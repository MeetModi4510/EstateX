export const MOCK_SEARCH_RESULTS = [
  {
    id: 1,
    images: [
      'https://images.unsplash.com/photo-1613490900233-141c5123d248?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'
    ],
    verified: true,
    matchScore: 98,
    price: '₹2.5 Cr',
    emi: '₹1.85 L',
    title: 'Luxury Villa with Pool',
    location: 'Lathi Road, Amreli',
    beds: 5,
    baths: 6,
    area: '4,500 sqft',
    parking: 3,
    type: 'Villa',
    shortDescription: 'Stunning luxury villa featuring a private pool, modern architecture, and a spacious garden.',
    listedBy: 'Builder',
    postedDate: '2 days ago',
    tags: ['Luxury', 'Ready to Move']
  },
  {
    id: 2,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'
    ],
    verified: true,
    matchScore: 89,
    price: '₹1.2 Cr',
    emi: '₹88 K',
    title: 'Modern Penthouse',
    location: 'Chakkargadh Road, Amreli',
    beds: 3,
    baths: 2,
    area: '2,100 sqft',
    parking: 1,
    type: 'Apartment',
    shortDescription: 'Beautiful modern penthouse with panoramic city views and premium fittings.',
    listedBy: 'Owner',
    postedDate: '5 days ago',
    tags: ['New', 'Investment']
  },
  {
    id: 3,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1613490900233-141c5123d248?auto=format&fit=crop&q=80&w=800'
    ],
    verified: false,
    matchScore: 76,
    price: '₹85 Lakhs',
    emi: '₹62 K',
    title: 'Spacious Family Home',
    location: 'Jesingpara, Amreli',
    beds: 4,
    baths: 3,
    area: '3,200 sqft',
    parking: 2,
    type: 'Independent House',
    shortDescription: 'Perfect family home located in a quiet neighborhood with excellent schools nearby.',
    listedBy: 'Broker',
    postedDate: '1 week ago',
    tags: ['Family', 'Budget Friendly']
  },
  {
    id: 4,
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
    ],
    verified: true,
    matchScore: 92,
    price: '₹95 Lakhs',
    emi: '₹70 K',
    title: 'Minimalist Smart House',
    location: 'Liliya Road, Amreli',
    beds: 3,
    baths: 3,
    area: '2,800 sqft',
    parking: 1,
    type: 'Villa',
    shortDescription: 'Smart home equipped with modern automation systems and minimal aesthetics.',
    listedBy: 'Builder',
    postedDate: 'Just now',
    tags: ['Luxury', 'New']
  },
  {
    id: 5,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800'
    ],
    verified: true,
    matchScore: 85,
    price: '₹1.75 Cr',
    emi: '₹1.3 L',
    title: 'Suburban Estate',
    location: 'Gajera Para, Amreli',
    beds: 6,
    baths: 5,
    area: '5,000 sqft',
    parking: 4,
    type: 'Villa',
    shortDescription: 'Massive suburban estate featuring a large backyard, home theater, and gym.',
    listedBy: 'Owner',
    postedDate: '3 days ago',
    tags: ['Family', 'Garden View']
  },
  {
    id: 6,
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1613490900233-141c5123d248?auto=format&fit=crop&q=80&w=800'
    ],
    verified: false,
    matchScore: 71,
    price: '₹1.4 Cr',
    emi: '₹1.05 L',
    title: 'Independent House',
    location: 'Station Road, Amreli',
    beds: 4,
    baths: 4,
    area: '3,500 sqft',
    parking: 2,
    type: 'Independent House',
    shortDescription: 'A classic independent house centrally located with easy access to transport.',
    listedBy: 'Broker',
    postedDate: '2 weeks ago',
    tags: ['Investment']
  }
];

export const MOCK_RECENTLY_VIEWED = MOCK_SEARCH_RESULTS.slice(0, 4);
export const MOCK_RECOMMENDED = MOCK_SEARCH_RESULTS.slice(2, 6);
