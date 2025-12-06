
import { Facility, MembershipPlan, Event, Booking } from './types';

export const APP_NAME = "GRIT X";

export const FACILITIES_DATA: Facility[] = [
  {
    id: '1',
    slug: 'box-cricket-arena',
    name: 'Box Cricket Arena',
    description: 'ProTurf A & B. Premium indoor AstroTurf arenas featuring shock-absorbing turf, LED floodlights, and digital scoreboards. Perfect for leather and soft ball matches in an air-cooled environment.',
    image: '/assets/cricketarena.png',
    capacity: 22,
    features: ['Shock-absorbing Turf', 'LED Floodlights', 'Digital Scoreboards', 'Bowling Machine', 'Air-cooled'],
    hourlyRate: 60,
  },
  {
    id: '2',
    slug: 'futsal-flex-arena',
    name: 'Futsal Flex Arena',
    description: 'FIFA-certified indoor turf for 5v5 Football. Features high roof clearance, motion-tracking goalpost sensors, and integrated match recording cameras with a viewing gallery.',
    image: '/assets/futsal-flex-arena.jpg',
    capacity: 14,
    features: ['FIFA-certified Turf', 'Motion Sensors', 'Match Recording', 'Viewing Gallery', 'High Roof'],
    hourlyRate: 80,
  },
  {
    id: '3',
    slug: 'feather-court-zone',
    name: 'FeatherCourt Zone',
    description: 'Professional badminton courts featuring Yonex-certified synthetic flooring and anti-glare LED lighting. Tournament-level net setups optimized for competitive play.',
    image: '/assets/feather-court-zone.jpg',
    capacity: 8,
    features: ['Yonex-certified Flooring', 'Anti-glare Lighting', 'Tournament Nets', 'Pro Markings'],
    hourlyRate: 25,
  },
  {
    id: '4',
    slug: 'spinlab-studio',
    name: 'SpinLab Studio',
    description: 'Advanced Table Tennis studio equipped with ITTF-approved tables, anti-slip flooring, and shadow-free lighting. Includes robot coaching assistance.',
    image: '/assets/spinlab-studio.jpg',
    capacity: 4,
    features: ['ITTF-approved Tables', 'Shadow-free Lighting', 'Robot Coach', 'Acoustically Treated'],
    hourlyRate: 20,
  },
  {
    id: '5',
    slug: 'grit-performance-lab',
    name: 'Grit Performance Lab',
    description: 'Elite strength and conditioning studio. Includes functional training equipment, a plyometric zone, free-weight section, and a warm-up turf lane.',
    image: '/assets/grit-performance-lab.jpg',
    capacity: 15,
    features: ['Functional Equipment', 'Plyometric Zone', 'Free-weights', 'Warm-up Turf'],
    hourlyRate: 35,
  },
  {
    id: '6',
    slug: 'junior-active-arena',
    name: 'Junior Active Arena',
    description: 'Safe, padded multi-activity zone designed for kids fitness, beginner coaching, and birthday events. Includes mini-hurdles and ladders.',
    image: '/assets/junior-active-arena.jpg',
    capacity: 25,
    features: ['Padded Flooring', 'Mini-hurdles', 'Beginner Setup', 'Safety First'],
    hourlyRate: 45,
  }
];

export const EVENTS_DATA: Event[] = [
  {
    id: 'e1',
    title: 'GRITx Summer Sports Carnival 2025',
    date: '2025-06-15',
    time: '10:00 AM – 7:00 PM',
    location: 'GRITx Main Arena & Outdoor Courts',
    description: 'A full-day, action-packed community festival featuring friendly competitions across Box Cricket, Futsal, Badminton, and Table Tennis. Attendees enjoy food stalls, music, challenge zones, skill-based mini-games, and live DJ sessions.',
    image: 'https://images.unsplash.com/photo-1533560906234-54cb6223257d?auto=format&fit=crop&q=80&w=1000',
    category: 'Social',
  },
  {
    id: 'e2',
    title: 'GRITx Elite Badminton Championship',
    date: '2025-08-02',
    time: '09:00 AM – 6:00 PM',
    location: 'GRITx Indoor Badminton Arena',
    description: 'A high-intensity competitive tournament open to intermediate and advanced players. The event follows BAI-style rules with knockout rounds leading to the finals. Certified referees ensure fair play and accurate scoring.',
    image: 'https://images.unsplash.com/photo-1626224583764-84786c713608?auto=format&fit=crop&q=80&w=1000',
    category: 'Competition',
  },
  {
    id: 'e3',
    title: 'GRITx Midnight Turf Marathon',
    date: '2025-09-21',
    time: '08:00 PM – 08:00 AM',
    location: 'GRITx Outdoor Futsal Turf',
    description: 'An ultra-unique overnight futsal endurance challenge, combining sport, stamina, strategy, and teamwork. Teams rotate players throughout the night, competing in short matches with points accumulated towards the final leaderboard.',
    image: 'https://images.unsplash.com/photo-1518605348400-43a5cbc5ca44?auto=format&fit=crop&q=80&w=1000',
    category: 'Competition',
  },
  {
    id: 'e4',
    title: 'GRITx Corporate Wellness Week',
    date: '2025-11-05',
    time: '07:00 AM – 09:00 PM',
    location: 'GRITx Fitness Studio',
    description: 'A week-long professional development and wellness camp for corporate teams. Featuring expert-led workshops, fitness assessments, nutrition coaching, team-building sports sessions, and stress-management modules.',
    image: 'https://images.unsplash.com/photo-1574680096141-1fddd6eb58db?auto=format&fit=crop&q=80&w=1000',
    category: 'Professional',
  }
];

export const MEMBERSHIPS_DATA: MembershipPlan[] = [
  {
    id: 'basic',
    name: 'Athlete Basic',
    price: 49,
    billingCycle: 'monthly',
    features: ['Gym Access', 'Locker Room Access', '1 Guest Pass/Month', 'Mobile App Access'],
  },
  {
    id: 'pro',
    name: 'Pro Performance',
    price: 99,
    billingCycle: 'monthly',
    features: ['All Basic Features', 'Aquatic Center Access', 'Group Classes', 'Recovery Zone Access', '5 Guest Passes/Month'],
    recommended: true,
  },
  {
    id: 'elite',
    name: 'Elite All-Access',
    price: 199,
    billingCycle: 'monthly',
    features: ['All Pro Features', '24/7 Access', 'Private Locker', 'Personal Training (2x/mo)', 'Co-Working Access'],
  }
];

export const RECENT_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    facilityId: '1',
    facilityName: 'Box Cricket Arena',
    userId: 'u1',
    userName: 'Alex Johnson',
    date: '2023-11-10',
    startTime: '18:00',
    endTime: '19:00',
    status: 'confirmed',
    totalPrice: 60,
  },
  {
    id: 'b2',
    facilityId: '2',
    facilityName: 'Futsal Flex Arena',
    userId: 'u2',
    userName: 'Sarah Smith',
    date: '2023-11-12',
    startTime: '19:00',
    endTime: '20:00',
    status: 'pending',
    totalPrice: 80,
  },
  {
    id: 'b3',
    facilityId: '3',
    facilityName: 'FeatherCourt Zone',
    userId: 'u3',
    userName: 'Mike Ross',
    date: '2023-11-15',
    startTime: '07:00',
    endTime: '08:00',
    status: 'confirmed',
    totalPrice: 25,
  }
];
