import { Category, Job, WorkerProfile, NotificationItem, Review, Dispute, CommissionConfig } from '../types';

export interface PuneLocality {
  name: string;
  lat: number;
  lng: number;
  zone: 'East' | 'West' | 'Central' | 'South' | 'North' | 'PCMC';
}

export const PUNE_LOCALITIES: PuneLocality[] = [
  { name: 'Kharadi', lat: 18.5514, lng: 73.9348, zone: 'East' },
  { name: 'Viman Nagar', lat: 18.5679, lng: 73.9143, zone: 'East' },
  { name: 'Hadapsar', lat: 18.5089, lng: 73.9259, zone: 'East' },
  { name: 'Wagholi', lat: 18.5808, lng: 73.9787, zone: 'East' },
  { name: 'Magarpatta', lat: 18.5158, lng: 73.9272, zone: 'East' },
  { name: 'Koregaon Park', lat: 18.5362, lng: 73.8940, zone: 'Central' },
  { name: 'Kalyani Nagar', lat: 18.5477, lng: 73.9038, zone: 'East' },
  { name: 'Shivajinagar', lat: 18.5314, lng: 73.8446, zone: 'Central' },
  { name: 'Camp', lat: 18.5133, lng: 73.8784, zone: 'Central' },
  { name: 'Yerawada', lat: 18.5529, lng: 73.8828, zone: 'Central' },
  { name: 'Baner', lat: 18.5590, lng: 73.7868, zone: 'West' },
  { name: 'Balewadi', lat: 18.5762, lng: 73.7745, zone: 'West' },
  { name: 'Aundh', lat: 18.5626, lng: 73.8087, zone: 'West' },
  { name: 'Wakad', lat: 18.5987, lng: 73.7667, zone: 'West' },
  { name: 'Hinjewadi', lat: 18.5913, lng: 73.7389, zone: 'West' },
  { name: 'Pimple Saudagar', lat: 18.5987, lng: 73.7997, zone: 'West' },
  { name: 'Kothrud', lat: 18.5074, lng: 73.8077, zone: 'West' },
  { name: 'Karve Nagar', lat: 18.4902, lng: 73.8188, zone: 'West' },
  { name: 'Bibwewadi', lat: 18.4728, lng: 73.8647, zone: 'South' },
  { name: 'Kondhwa', lat: 18.4695, lng: 73.8940, zone: 'South' },
  { name: 'Pimpri', lat: 18.6279, lng: 73.8009, zone: 'PCMC' },
  { name: 'Chinchwad', lat: 18.6298, lng: 73.7824, zone: 'PCMC' },
];

// Helper to calculate approximate distance in km between two Pune areas
export function calculatePuneDistance(area1: string, area2: string): number {
  const loc1 = PUNE_LOCALITIES.find(l => l.name.toLowerCase() === area1.toLowerCase()) || PUNE_LOCALITIES[0];
  const loc2 = PUNE_LOCALITIES.find(l => l.name.toLowerCase() === area2.toLowerCase()) || PUNE_LOCALITIES[1];

  // Haversine formula
  const R = 6371; // km
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const dLon = ((loc2.lng - loc1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.max(0.8, Number(d.toFixed(1)));
}

export const CATEGORIES: Category[] = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    hindiName: 'प्लंबिंग (नल / पाइप)',
    marathiName: 'प्लंबिंग (नळ / पाईप)',
    icon: 'Wrench',
    color: 'blue',
    subcategories: [
      { id: 'tap_repair', name: 'Tap Repair & Installation', avgPriceEstimate: '₹200 - ₹500' },
      { id: 'pipe_leakage', name: 'Pipe Leakage Repair', avgPriceEstimate: '₹350 - ₹900' },
      { id: 'bathroom_plumbing', name: 'Bathroom Plumbing', avgPriceEstimate: '₹500 - ₹1,500' },
      { id: 'drain_blockage', name: 'Drain & Sewer Blockage', avgPriceEstimate: '₹400 - ₹1,000' },
      { id: 'water_tank', name: 'Water Tank Cleaning / Fitting', avgPriceEstimate: '₹800 - ₹2,500' },
      { id: 'toilet_repair', name: 'Toilet Flush & Commode Repair', avgPriceEstimate: '₹300 - ₹800' },
      { id: 'wash_basin', name: 'Wash Basin Installation / Repair', avgPriceEstimate: '₹350 - ₹750' }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical',
    hindiName: 'इलेक्ट्रिकल (बिजली काम)',
    marathiName: 'इलेक्ट्रिकल (विद्युत काम)',
    icon: 'Zap',
    color: 'amber',
    subcategories: [
      { id: 'fan_install', name: 'Ceiling Fan Installation & Repair', avgPriceEstimate: '₹150 - ₹400' },
      { id: 'switch_repair', name: 'Switchboard & Socket Repair', avgPriceEstimate: '₹150 - ₹350' },
      { id: 'light_install', name: 'LED & Light Fixture Setup', avgPriceEstimate: '₹200 - ₹600' },
      { id: 'wiring_mcb', name: 'Wiring & MCB Tripping Fix', avgPriceEstimate: '₹400 - ₹1,200' },
      { id: 'inverter_setup', name: 'Inverter & Battery Wiring', avgPriceEstimate: '₹500 - ₹1,500' },
      { id: 'electrical_inspection', name: 'Full Home Electrical Inspection', avgPriceEstimate: '₹400 - ₹800' }
    ]
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    hindiName: 'बढ़ई (कारपेंटर)',
    marathiName: 'सुतार (कारपेंटर)',
    icon: 'Hammer',
    color: 'amber',
    subcategories: [
      { id: 'furniture_repair', name: 'Wooden Furniture Repair', avgPriceEstimate: '₹350 - ₹900' },
      { id: 'door_lock', name: 'Door & Lock Installation / Repair', avgPriceEstimate: '₹300 - ₹700' },
      { id: 'cabinet_repair', name: 'Kitchen Cabinet & Hinge Fix', avgPriceEstimate: '₹400 - ₹1,200' },
      { id: 'bed_table', name: 'Bed & Dining Table Assembly', avgPriceEstimate: '₹500 - ₹1,400' },
      { id: 'custom_woodwork', name: 'Custom Shelves & Woodwork', avgPriceEstimate: '₹800 - ₹3,000' }
    ]
  },
  {
    id: 'household_help',
    name: 'Household Help',
    hindiName: 'घरेलू सहायिका (सफाई / खाना)',
    marathiName: 'घरगुती मदत (सफाई / स्वयंपाक)',
    icon: 'Sparkles',
    color: 'emerald',
    subcategories: [
      { id: 'deep_cleaning', name: 'Deep Home Cleaning', avgPriceEstimate: '₹1,200 - ₹3,500' },
      { id: 'bathroom_cleaning', name: 'Bathroom Acid/Deep Cleaning', avgPriceEstimate: '₹400 - ₹900' },
      { id: 'kitchen_cleaning', name: 'Kitchen Degreasing & Cleaning', avgPriceEstimate: '₹600 - ₹1,500' },
      { id: 'regular_maid', name: 'Part-Time / Regular Maid', avgPriceEstimate: '₹1,500 - ₹4,000/mo' },
      { id: 'cook_chef', name: 'Home Cook (Veg/Non-Veg)', avgPriceEstimate: '₹2,500 - ₹6,000/mo' },
      { id: 'elderly_assistant', name: 'Elderly Assistance & Helper', avgPriceEstimate: '₹5,000 - ₹12,000/mo' }
    ]
  },
  {
    id: 'appliance_repair',
    name: 'Appliance Repair',
    hindiName: 'उपकरण मरम्मत (AC/फ्रिज/गीज़र)',
    marathiName: 'घरगुती उपकरण दुरुस्ती (AC/फ्रिज/गीझर)',
    icon: 'Refrigerator',
    color: 'sky',
    subcategories: [
      { id: 'ac_service', name: 'AC Service, Gas & Jet Clean', avgPriceEstimate: '₹499 - ₹1,800' },
      { id: 'refrigerator_repair', name: 'Refrigerator Cooling & Compressor', avgPriceEstimate: '₹350 - ₹1,200' },
      { id: 'washing_machine', name: 'Washing Machine Motor & Drum', avgPriceEstimate: '₹400 - ₹1,400' },
      { id: 'geyser_repair', name: 'Geyser Heating Element & Valve', avgPriceEstimate: '₹300 - ₹750' },
      { id: 'water_purifier', name: 'RO Water Purifier Filter Service', avgPriceEstimate: '₹350 - ₹1,200' },
      { id: 'microwave_oven', name: 'Microwave Oven Heating Fix', avgPriceEstimate: '₹300 - ₹800' }
    ]
  },
  {
    id: 'painting',
    name: 'Painting',
    hindiName: 'पेंटर (रंगाई / पुट्टी)',
    marathiName: 'रंगारी (पेंटर / पुट्टी)',
    icon: 'Paintbrush',
    color: 'rose',
    subcategories: [
      { id: 'touchup_painting', name: 'Single Wall / Touchup Painting', avgPriceEstimate: '₹500 - ₹1,500' },
      { id: 'room_painting', name: '1 Room Full Wall Painting', avgPriceEstimate: '₹2,500 - ₹5,000' },
      { id: 'full_home_painting', name: 'Full House Interior Painting', avgPriceEstimate: '₹8,000 - ₹35,000' },
      { id: 'waterproof_coating', name: 'Waterproofing & Damp Proofing', avgPriceEstimate: '₹3,000 - ₹10,000' }
    ]
  },
  {
    id: 'mason',
    name: 'Mason & Construction',
    hindiName: 'राजमिस्त्री (सीमेंट / टाइल)',
    marathiName: 'गवंडी (सिमेंट / टाईल्स काम)',
    icon: 'Blocks',
    color: 'stone',
    subcategories: [
      { id: 'tile_repair', name: 'Broken Tile & Grouting Fix', avgPriceEstimate: '₹400 - ₹1,200' },
      { id: 'wall_plaster', name: 'Wall Crack & Plaster Repair', avgPriceEstimate: '₹500 - ₹1,800' },
      { id: 'minor_civil', name: 'Kitchen Counter / Minor Civil Work', avgPriceEstimate: '₹1,000 - ₹4,000' },
      { id: 'brick_cement', name: 'Brickwork & Concrete Base', avgPriceEstimate: '₹1,500 - ₹5,000' }
    ]
  },
  {
    id: 'technical',
    name: 'Laptop & Tech Repair',
    hindiName: 'लैपटॉप / कंप्यूटर रिपेयर',
    marathiName: 'लॅपटॉप / संगणक दुरुस्ती',
    icon: 'Laptop',
    color: 'indigo',
    subcategories: [
      { id: 'laptop_service', name: 'Laptop Overheating & Fan Clean', avgPriceEstimate: '₹350 - ₹800' },
      { id: 'os_format', name: 'Windows / Mac Formatting & SSD', avgPriceEstimate: '₹400 - ₹1,000' },
      { id: 'screen_keyboard', name: 'Screen & Keyboard Replacement', avgPriceEstimate: '₹800 - ₹3,500' },
      { id: 'wifi_cctv', name: 'WiFi Router & CCTV Camera Setup', avgPriceEstimate: '₹500 - ₹1,800' }
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile Repair',
    hindiName: 'मोबाइल रिपेयरिंग',
    marathiName: 'मोबाईल दुरुस्ती',
    icon: 'Smartphone',
    color: 'violet',
    subcategories: [
      { id: 'screen_replace', name: 'Display & Glass Screen Fix', avgPriceEstimate: '₹800 - ₹3,500' },
      { id: 'battery_charging', name: 'Battery Drain & Charging Port', avgPriceEstimate: '₹350 - ₹900' },
      { id: 'speaker_mic', name: 'Speaker & Mic Audio Issues', avgPriceEstimate: '₹300 - ₹700' }
    ]
  },
  {
    id: 'vehicle',
    name: 'Vehicle Mechanics',
    hindiName: 'बाइक / कार मैकेनिक',
    marathiName: 'बाईक / कार मेकॅनिक',
    icon: 'Car',
    color: 'teal',
    subcategories: [
      { id: 'puncture_doorstep', name: 'Doorstep Two-Wheeler Puncture', avgPriceEstimate: '₹150 - ₹350' },
      { id: 'bike_servicing', name: 'Bike General Oil Service', avgPriceEstimate: '₹400 - ₹900' },
      { id: 'car_battery_jump', name: 'Car Battery Jumpstart & Check', avgPriceEstimate: '₹350 - ₹750' },
      { id: 'car_foam_wash', name: 'Doorstep Car Foam Wash', avgPriceEstimate: '₹450 - ₹950' }
    ]
  },
  {
    id: 'personal_services',
    name: 'Personal Grooming',
    hindiName: 'ब्यूटीशियन / नाई / मेंहदी',
    marathiName: 'ब्युटीशियन / नाभिक / मेंहदी',
    icon: 'Scissors',
    color: 'pink',
    subcategories: [
      { id: 'mens_haircut', name: 'Doorstep Men Haircut & Beard', avgPriceEstimate: '₹200 - ₹450' },
      { id: 'womens_waxing', name: 'Salon at Home (Waxing/Facial)', avgPriceEstimate: '₹500 - ₹1,800' },
      { id: 'mehendi_bridal', name: 'Mehendi Artist for Events', avgPriceEstimate: '₹500 - ₹3,500' }
    ]
  },
  {
    id: 'moving_help',
    name: 'Moving & Labour Help',
    hindiName: 'लोडिंग / अनलोडिंग / शिफ्टिंग',
    marathiName: 'लोडिंग / अनलोडिंग / स्थलांतर',
    icon: 'Truck',
    color: 'orange',
    subcategories: [
      { id: 'shifting_helpers', name: 'Household Shifting Helpers (Per Person)', avgPriceEstimate: '₹600 - ₹1,200/day' },
      { id: 'loading_unloading', name: 'Heavy Goods Loading & Unloading', avgPriceEstimate: '₹400 - ₹900' },
      { id: 'tempo_transport', name: 'Chota Hathi / Tempo Local Haul', avgPriceEstimate: '₹800 - ₹2,500' }
    ]
  }
];

export const INITIAL_WORKERS: WorkerProfile[] = [
  {
    id: 'w-1',
    userId: 'u-w1',
    name: 'Santosh Shinde',
    mobile: '+91 98220 14820',
    profilePhoto: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
    primaryCategory: 'Plumbing',
    otherSkills: ['Drain Unblocking', 'Water Tank Fitting', 'Bathroom Fittings'],
    experienceYears: 9,
    rating: 4.88,
    totalReviews: 142,
    completedJobs: 178,
    responseRatePercent: 96,
    completionRatePercent: 99,
    baseLocality: 'Kharadi',
    serviceAreas: ['Kharadi', 'Viman Nagar', 'Wagholi', 'Kalyani Nagar', 'Hadapsar', 'Magarpatta'],
    startingPrice: 249,
    languages: ['Marathi', 'Hindi', 'Basic English'],
    workingHours: '7:30 AM - 9:00 PM',
    isAvailable: true,
    emergencyAvailable: true,
    about: 'Experienced plumber serving East Pune for over 9 years. Specializing in fast leakage fixes, concealed pipeline repairs, Grohe/Jaquar CP fittings, and drain clearing. Carry all standard spare washers and tools.',
    verification: {
      phoneVerified: true,
      identityVerified: true,
      skillVerified: true,
      backgroundVerified: true,
      topRated: true,
      experienced: true
    },
    portfolioImages: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=500&auto=format&fit=crop&q=80'
    ],
    reviews: [
      {
        id: 'r-1',
        jobId: 'j-101',
        reviewerId: 'c-1',
        reviewerName: 'Rohit Kulkarni',
        targetId: 'w-1',
        targetRole: 'worker',
        rating: 5,
        qualityRating: 5,
        punctualityRating: 5,
        behaviourRating: 5,
        professionalismRating: 5,
        valueRating: 5,
        comment: 'Santosh reached my apartment in Kharadi within 25 minutes of calling. Replaced the broken kitchen angle valve cleanly with zero mess. Very polite and fair pricing!',
        date: '2026-09-15'
      },
      {
        id: 'r-2',
        jobId: 'j-102',
        reviewerId: 'c-2',
        reviewerName: 'Pooja Agarwal',
        targetId: 'w-1',
        targetRole: 'worker',
        rating: 4.8,
        qualityRating: 5,
        punctualityRating: 4,
        behaviourRating: 5,
        professionalismRating: 5,
        valueRating: 5,
        comment: 'Fixed severe drain blockage in my Viman Nagar flat. Transparent with material cost receipt.',
        date: '2026-09-10'
      }
    ],
    totalEarnings: 24650
  },
  {
    id: 'w-2',
    userId: 'u-w2',
    name: 'Rahul Jadhav',
    mobile: '+91 97632 88412',
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    primaryCategory: 'Electrical',
    otherSkills: ['Ceiling Fans', 'Inverter Wiring', 'MCB Tripping', 'LED Chandeliers'],
    experienceYears: 7,
    rating: 4.82,
    totalReviews: 98,
    completedJobs: 124,
    responseRatePercent: 94,
    completionRatePercent: 98,
    baseLocality: 'Wakad',
    serviceAreas: ['Wakad', 'Hinjewadi', 'Baner', 'Balewadi', 'Pimple Saudagar', 'Aundh'],
    startingPrice: 199,
    languages: ['Marathi', 'Hindi', 'English'],
    workingHours: '8:00 AM - 9:30 PM',
    isAvailable: true,
    emergencyAvailable: true,
    about: 'ITI Certified Wireman with 7 years experience in modern society apartments in Wakad and Hinjewadi IT park. Expert in troubleshooting electrical tripping, short circuits, and neat aesthetic wiring.',
    verification: {
      phoneVerified: true,
      identityVerified: true,
      skillVerified: true,
      backgroundVerified: true,
      topRated: true,
      experienced: true
    },
    portfolioImages: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80'
    ],
    reviews: [
      {
        id: 'r-3',
        jobId: 'j-103',
        reviewerId: 'c-3',
        reviewerName: 'Amit Deshmukh',
        targetId: 'w-2',
        targetRole: 'worker',
        rating: 5,
        qualityRating: 5,
        punctualityRating: 5,
        behaviourRating: 5,
        professionalismRating: 5,
        valueRating: 5,
        comment: 'Installed 3 BLDC ceiling fans and fixed faulty MCB in Hinjewadi Phase 1. Highly skilled and neat work.',
        date: '2026-09-18'
      }
    ],
    totalEarnings: 18900
  },
  {
    id: 'w-3',
    userId: 'u-w3',
    name: 'Anil Gaikwad',
    mobile: '+91 94225 33190',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    primaryCategory: 'Carpentry',
    otherSkills: ['Modular Kitchen Hinges', 'Door Lock Installation', 'Bed Assembly', 'Balcony Cabinets'],
    experienceYears: 12,
    rating: 4.91,
    totalReviews: 165,
    completedJobs: 210,
    responseRatePercent: 92,
    completionRatePercent: 99,
    baseLocality: 'Kothrud',
    serviceAreas: ['Kothrud', 'Karve Nagar', 'Shivajinagar', 'Aundh', 'Baner', 'Bibwewadi'],
    startingPrice: 299,
    languages: ['Marathi', 'Hindi'],
    workingHours: '8:30 AM - 8:00 PM',
    isAvailable: true,
    emergencyAvailable: false,
    about: 'Master carpenter specializing in solid wood, plywood, hydraulic hinges (Hettich / Hafele) and Godrej lock installations. 12+ years of honest craftsmanship in Kothrud and Deccan area.',
    verification: {
      phoneVerified: true,
      identityVerified: true,
      skillVerified: true,
      backgroundVerified: true,
      topRated: true,
      experienced: true
    },
    portfolioImages: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=500&auto=format&fit=crop&q=80'
    ],
    reviews: [
      {
        id: 'r-4',
        jobId: 'j-104',
        reviewerId: 'c-4',
        reviewerName: 'Vandana Joshi',
        targetId: 'w-3',
        targetRole: 'worker',
        rating: 5,
        qualityRating: 5,
        punctualityRating: 5,
        behaviourRating: 5,
        professionalismRating: 5,
        valueRating: 5,
        comment: 'Fixed all sagging kitchen cabinet doors and aligned wardrobe sliders perfectly. Very experienced!',
        date: '2026-09-12'
      }
    ],
    totalEarnings: 31200
  },
  {
    id: 'w-4',
    userId: 'u-w4',
    name: 'Sunita Kamble',
    mobile: '+91 96570 19284',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    primaryCategory: 'Household Help',
    otherSkills: ['Deep Cleaning', 'Kitchen Degreasing', 'Bathroom Descaling', 'Home Cooking'],
    experienceYears: 6,
    rating: 4.85,
    totalReviews: 112,
    completedJobs: 155,
    responseRatePercent: 97,
    completionRatePercent: 98,
    baseLocality: 'Hadapsar',
    serviceAreas: ['Hadapsar', 'Magarpatta', 'Kharadi', 'Kalyani Nagar', 'Koregaon Park'],
    startingPrice: 399,
    languages: ['Marathi', 'Hindi'],
    workingHours: '7:00 AM - 6:00 PM',
    isAvailable: true,
    emergencyAvailable: false,
    about: 'Reliable and detail-oriented housekeeper. Thorough in kitchen chimney/stove degreasing, bathroom tiles stain cleaning, and post-tenancy move-in cleaning. Honest and hard-working.',
    verification: {
      phoneVerified: true,
      identityVerified: true,
      skillVerified: true,
      backgroundVerified: true,
      topRated: true,
      experienced: true
    },
    portfolioImages: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80'
    ],
    reviews: [
      {
        id: 'r-5',
        jobId: 'j-105',
        reviewerId: 'c-5',
        reviewerName: 'Sneha Patil',
        targetId: 'w-4',
        targetRole: 'worker',
        rating: 5,
        qualityRating: 5,
        punctualityRating: 5,
        behaviourRating: 5,
        professionalismRating: 5,
        valueRating: 5,
        comment: 'Sunita did a wonderful deep cleaning of my Magarpatta 2BHK before Diwali. Kitchen tiles are shining like new.',
        date: '2026-09-17'
      }
    ],
    totalEarnings: 28400
  },
  {
    id: 'w-5',
    userId: 'u-w5',
    name: 'Ramesh Patil',
    mobile: '+91 98811 74211',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    primaryCategory: 'Appliance Repair',
    otherSkills: ['AC Jet Wash', 'Refrigerator Compressor', 'Washing Machine Drum', 'Geyser Coil'],
    experienceYears: 8,
    rating: 4.79,
    totalReviews: 84,
    completedJobs: 110,
    responseRatePercent: 91,
    completionRatePercent: 96,
    baseLocality: 'Baner',
    serviceAreas: ['Baner', 'Balewadi', 'Aundh', 'Pimple Saudagar', 'Wakad', 'Shivajinagar'],
    startingPrice: 349,
    languages: ['Marathi', 'Hindi', 'English'],
    workingHours: '8:00 AM - 8:30 PM',
    isAvailable: true,
    emergencyAvailable: true,
    about: 'Certified HVAC & White Goods technician. Specialized in split AC foam jet cleaning, gas charging, inverter refrigerator sensors, and front-load washing machine bearing replacements.',
    verification: {
      phoneVerified: true,
      identityVerified: true,
      skillVerified: true,
      backgroundVerified: false,
      topRated: true,
      experienced: true
    },
    portfolioImages: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&auto=format&fit=crop&q=80'
    ],
    reviews: [
      {
        id: 'r-6',
        jobId: 'j-106',
        reviewerId: 'c-6',
        reviewerName: 'Kunal Sen',
        targetId: 'w-5',
        targetRole: 'worker',
        rating: 5,
        qualityRating: 5,
        punctualityRating: 4,
        behaviourRating: 5,
        professionalismRating: 5,
        valueRating: 5,
        comment: 'Diagnosed geyser short circuit accurately without trying to sell unnecessary parts. Saved me money.',
        date: '2026-09-14'
      }
    ],
    totalEarnings: 21300
  },
  {
    id: 'w-6',
    userId: 'u-w6',
    name: 'Vikram Shinde',
    mobile: '+91 95118 63022',
    profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    primaryCategory: 'Technical',
    otherSkills: ['Laptop Screen Replacement', 'Data Recovery', 'WiFi Mesh Setup', 'MacBook Repair'],
    experienceYears: 6,
    rating: 4.89,
    totalReviews: 92,
    completedJobs: 135,
    responseRatePercent: 98,
    completionRatePercent: 99,
    baseLocality: 'Viman Nagar',
    serviceAreas: ['Viman Nagar', 'Kharadi', 'Kalyani Nagar', 'Koregaon Park', 'Yerawada'],
    startingPrice: 350,
    languages: ['English', 'Hindi', 'Marathi'],
    workingHours: '9:00 AM - 9:00 PM',
    isAvailable: true,
    emergencyAvailable: false,
    about: 'Doorstep computer hardware & network engineer. Fast SSD upgrades, Windows/macOS formatting, thermal paste renewal for gaming/work laptops, and home mesh WiFi configuration.',
    verification: {
      phoneVerified: true,
      identityVerified: true,
      skillVerified: true,
      backgroundVerified: true,
      topRated: true,
      experienced: true
    },
    portfolioImages: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80'
    ],
    reviews: [
      {
        id: 'r-7',
        jobId: 'j-107',
        reviewerId: 'c-7',
        reviewerName: 'Priyanka Verma',
        targetId: 'w-6',
        targetRole: 'worker',
        rating: 5,
        qualityRating: 5,
        punctualityRating: 5,
        behaviourRating: 5,
        professionalismRating: 5,
        valueRating: 5,
        comment: 'Upgraded SSD in my Dell laptop at my home in Viman Nagar. Took only 45 minutes, laptop is super fast now.',
        date: '2026-09-16'
      }
    ],
    totalEarnings: 27150
  },
  {
    id: 'w-7',
    userId: 'u-w7',
    name: 'Ganesh Chavan',
    mobile: '+91 98902 44109',
    profilePhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    primaryCategory: 'Painting',
    otherSkills: ['Wall Putty', 'Asian Paints Royale Touch', 'Waterproof Primer', 'Texture Wall'],
    experienceYears: 10,
    rating: 4.76,
    totalReviews: 76,
    completedJobs: 95,
    responseRatePercent: 88,
    completionRatePercent: 95,
    baseLocality: 'Pimple Saudagar',
    serviceAreas: ['Pimple Saudagar', 'Wakad', 'Pimpri', 'Chinchwad', 'Aundh', 'Baner'],
    startingPrice: 499,
    languages: ['Marathi', 'Hindi'],
    workingHours: '8:00 AM - 7:00 PM',
    isAvailable: true,
    emergencyAvailable: false,
    about: 'Professional painter with a team of 4 skilled helpers for touchups, rental repainting, and full house luxury texture paints. Clean masking tape protection for furniture guaranteed.',
    verification: {
      phoneVerified: true,
      identityVerified: true,
      skillVerified: true,
      backgroundVerified: false,
      topRated: false,
      experienced: true
    },
    portfolioImages: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80'
    ],
    reviews: [],
    totalEarnings: 38200
  },
  {
    id: 'w-8',
    userId: 'u-w8',
    name: 'Datta More',
    mobile: '+91 97664 12055',
    profilePhoto: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
    primaryCategory: 'Mason & Construction',
    otherSkills: ['Bathroom Tile Replacement', 'Waterproofing Slurry', 'Wall Plaster', 'Kitchen Granite Cut'],
    experienceYears: 14,
    rating: 4.81,
    totalReviews: 89,
    completedJobs: 118,
    responseRatePercent: 90,
    completionRatePercent: 97,
    baseLocality: 'Kalyani Nagar',
    serviceAreas: ['Kalyani Nagar', 'Koregaon Park', 'Yerawada', 'Viman Nagar', 'Shivajinagar', 'Camp'],
    startingPrice: 400,
    languages: ['Marathi', 'Hindi'],
    workingHours: '8:00 AM - 6:30 PM',
    isAvailable: true,
    emergencyAvailable: true,
    about: 'Reliable civil mason for home renovations, bathroom tile fixing, floor grouting, balcony leakage waterproofing and minor wall alterations. Fast and solid work.',
    verification: {
      phoneVerified: true,
      identityVerified: true,
      skillVerified: true,
      backgroundVerified: true,
      topRated: true,
      experienced: true
    },
    portfolioImages: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80'
    ],
    reviews: [],
    totalEarnings: 29500
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-101',
    customerId: 'c-1',
    customerName: 'Rohit Kulkarni',
    customerPhone: '+91 98230 55410',
    customerRating: 4.9,
    title: 'Bathroom angle valve leaking continuously',
    category: 'Plumbing',
    subcategory: 'Pipe Leakage Repair',
    description: 'The hot water angle valve under the wash basin has started dripping continuously and dripping onto the bathroom cabinet. Need urgent replacement.',
    photos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'
    ],
    locationArea: 'Kharadi',
    address: 'Flat 603, Tower B, Nyati Empire, Kharadi, Pune',
    pincode: '411014',
    preferredDate: 'Today',
    preferredTime: 'Between 5:00 PM - 7:00 PM',
    urgency: 'today',
    budgetMin: 350,
    budgetMax: 750,
    materialRequired: 'worker_provides',
    additionalNotes: 'Need a quality brass valve. Please bring bill for material.',
    status: 'RESPONSES_RECEIVED',
    postedAt: '2 hours ago',
    applications: [
      {
        id: 'app-1',
        jobId: 'job-101',
        workerId: 'w-1',
        workerName: 'Santosh Shinde',
        workerRating: 4.88,
        workerExperience: 9,
        workerPhoto: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
        estimatedPrice: 450,
        availableTime: 'Can reach by 5:30 PM today',
        message: 'Namaste Rohit ji. I am nearby in Kharadi near Eon IT park. I have Jaquar and standard brass valves in my kit. Can visit today at 5:30 PM.',
        estimatedDuration: '45 mins',
        materialCharge: 220,
        travelCharge: 0,
        createdAt: '1 hour ago',
        status: 'pending'
      }
    ],
    quotations: [
      {
        id: 'q-1',
        jobId: 'job-101',
        workerId: 'w-1',
        workerName: 'Santosh Shinde',
        labourCharge: 300,
        materialCharge: 220,
        travelCharge: 0,
        otherCharge: 0,
        total: 520,
        estimatedDuration: '45 mins',
        validity: 'Valid today',
        notes: 'Includes new brass heavy-duty angle valve with teflon tape seal and 30-day work warranty.',
        createdAt: '1 hour ago',
        status: 'sent'
      }
    ],
    isEmergency: false
  },
  {
    id: 'job-102',
    customerId: 'c-2',
    customerName: 'Pooja Agarwal',
    customerPhone: '+91 97654 33211',
    customerRating: 4.8,
    title: 'Emergency: Main MCB sparking and tripping',
    category: 'Electrical',
    subcategory: 'Wiring & MCB Tripping Fix',
    description: 'Every time we turn on the AC or geyser, the 32A main MCB switch trips with a spark sound. Half the house is without power.',
    photos: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80'
    ],
    locationArea: 'Wakad',
    address: 'B-402, Kalpataru Harmony, Kaspate Vasti, Wakad, Pune',
    pincode: '411057',
    preferredDate: 'Today',
    preferredTime: 'Immediately',
    urgency: 'emergency',
    budgetMin: 500,
    budgetMax: 1200,
    materialRequired: 'need_quotation',
    additionalNotes: 'Urgent emergency help needed please.',
    status: 'WORKER_SELECTED',
    assignedWorkerId: 'w-2',
    assignedWorkerName: 'Rahul Jadhav',
    postedAt: '35 mins ago',
    applications: [
      {
        id: 'app-2',
        jobId: 'job-102',
        workerId: 'w-2',
        workerName: 'Rahul Jadhav',
        workerRating: 4.82,
        workerExperience: 7,
        workerPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
        estimatedPrice: 650,
        availableTime: 'On the way (ETA 15 mins)',
        message: 'Carrying spare Havells/Schneider 32A MCB. Leaving now from Dutta Mandir road Wakad.',
        estimatedDuration: '1 hour',
        createdAt: '25 mins ago',
        status: 'accepted'
      }
    ],
    quotations: [],
    isEmergency: true
  },
  {
    id: 'job-103',
    customerId: 'c-3',
    customerName: 'Amit Deshmukh',
    customerPhone: '+91 98812 77019',
    customerRating: 5.0,
    title: 'Balcony wooden cabinet and sliding mesh repair',
    category: 'Carpentry',
    subcategory: 'Kitchen Cabinet & Hinge Fix',
    description: 'Rain water has swollen the bottom plywood shelf of the balcony storage cabinet. Need water-resistant ply piece replaced and mosquito mesh roller fixed.',
    photos: [],
    locationArea: 'Kothrud',
    address: 'Bungalow 12, Dahanukar Colony, Kothrud, Pune',
    pincode: '411038',
    preferredDate: 'Tomorrow',
    preferredTime: 'Morning 10:00 AM',
    urgency: 'tomorrow',
    budgetMin: 800,
    budgetMax: 1800,
    materialRequired: 'worker_provides',
    additionalNotes: 'Need marine ply (IS 710) so it does not swell again.',
    status: 'POSTED',
    postedAt: '4 hours ago',
    applications: [],
    quotations: [],
    isEmergency: false
  },
  {
    id: 'job-104',
    customerId: 'c-1',
    customerName: 'Rohit Kulkarni',
    customerPhone: '+91 98230 55410',
    customerRating: 4.9,
    title: 'Deep cleaning for 2BHK flat before tenant move-in',
    category: 'Household Help',
    subcategory: 'Deep Home Cleaning',
    description: 'Thorough cleaning required for 2 bathrooms, kitchen oil stains, window channels, and balcony floor mopping.',
    photos: [],
    locationArea: 'Hadapsar',
    pincode: '411028',
    preferredDate: 'This Week',
    preferredTime: 'Sunday 9:00 AM',
    urgency: 'this_week',
    budgetMin: 1800,
    budgetMax: 2800,
    materialRequired: 'worker_provides',
    status: 'COMPLETED',
    postedAt: '3 days ago',
    assignedWorkerId: 'w-4',
    assignedWorkerName: 'Sunita Kamble',
    finalPrice: 2200,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    applications: [],
    quotations: [],
    isEmergency: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    userId: 'c-1',
    title: 'Quotation Received',
    message: 'Santosh Shinde submitted a quote of ₹520 for your Bathroom Angle Valve job in Kharadi.',
    type: 'quote',
    linkId: 'job-101',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: 'n-2',
    userId: 'u-w1',
    title: 'New Nearby Job Alert',
    message: 'New plumbing job posted in Kharadi (1.8 km away): "Bathroom tap leakage".',
    type: 'job',
    linkId: 'job-101',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'n-3',
    userId: 'c-2',
    title: 'Worker Confirmed!',
    message: 'Rahul Jadhav accepted your emergency electrical job in Wakad and is on his way.',
    type: 'status',
    linkId: 'job-102',
    timestamp: '20 mins ago',
    read: false
  }
];

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'disp-1',
    jobId: 'job-99',
    jobTitle: 'Ceiling Fan regulator repair - Baner',
    reportedBy: 'c-8',
    reporterRole: 'customer',
    reportedUserName: 'Prakash Shinde (Electrician)',
    reason: 'Overcharging',
    description: 'Worker verbally agreed to ₹250 labour charge but demanded ₹600 after 15 mins of basic tape fixing.',
    status: 'investigating',
    createdAt: 'Yesterday',
    adminNotes: 'Contacted worker to submit original item bill. Awaiting response.'
  }
];

export const INITIAL_COMMISSION: CommissionConfig = {
  defaultPercentage: 10,
  categoryOverrides: {
    'household_help': 8,
    'technical': 12,
    'appliance_repair': 10,
    'plumbing': 10,
    'electrical': 10
  },
  fixedFeeAmount: 50,
  useFixedFee: false
};
