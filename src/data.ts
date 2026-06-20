import { MediaItem, SubscriptionPlan } from './types';

export const BRAND_NAME = "Novaplay Stream";

export const GENRES = [
  'All',
  'Action',
  'Comedy',
  'Drama',
  'Thriller',
  'Sci-Fi',
  'Horror',
  'Documentary',
  'Animation',
  'Crime',
  'Mystery',
  'Neo-Noir'
];

export const YEARS = ['All', '2025', '2024', '2023', '2022', '2021'];

export const SORTS = [
  { id: 'popular', name: 'Most Popular' },
  { id: 'top-rated', name: 'Highest Rated' },
  { id: 'newest', name: 'Latest Release' },
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free-trial',
    name: `${BRAND_NAME} 3-Day Free Trial`,
    price: '9.99',
    period: '$9.99/mo - billed monthly (3-day free trial)',
    features: [
      'Unlimited movies & TV shows',
      'Zero ads — ever',
      '4K Ultra HD + Dolby Vision audio',
      'Spatial Audio / Dolby Atmos',
      'Download for offline viewing',
      'Stream on 4 devices simultaneously',
      'New releases every Friday',
      `Early access to ${BRAND_NAME} Originals`,
      'Exclusive director\'s cuts',
      'Cancel anytime'
    ],
    isPopular: false,
    borderColor: 'border-cyan-500/45',
    glowColor: 'rgba(34, 211, 238, 0.45)',
    buttonText: 'Start 3-Day Free Trial'
  },
  {
    id: 'all-access',
    name: `${BRAND_NAME} Premium All-Access`,
    price: '19.99',
    period: '$19.99/mo - billed monthly',
    features: [
      'Unlimited movies & TV shows',
      'Zero ads — ever',
      '4K Ultra HD + Dolby Vision audio',
      'Spatial Audio / Dolby Atmos',
      'Download for offline viewing',
      'Stream on 4 devices simultaneously',
      'New releases every Friday',
      `Early access to ${BRAND_NAME} Originals`,
      'Exclusive director\'s cuts',
      'Cancel anytime'
    ],
    isPopular: true,
    borderColor: 'border-purple-500/45',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    buttonText: 'Start Streaming Free'
  }
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'nexus-protocol',
    title: 'Nexus Protocol',
    tagline: 'The last frontier of human consciousness',
    description: 'A rogue AI has embedded itself within the global neural network. One ex-operative must dive into the digital abyss to pull the plug — before the machine becomes god.',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
    rating: 9.1,
    year: 2157,
    duration: '2h 18m',
    genre: ['Sci-Fi', 'Thriller', 'Action'],
    type: 'movie',
    isTrending: true,
    isFeatured: true,
    views: 1240500,
    mirrors: [
      { id: 'nexus-m1', name: 'Server 1 - Primary (GlowCDN)', serverName: 'Server 1 - Primary (GlowCDN)', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active', delay: '24ms' },
      { id: 'nexus-m2', name: 'Server 2 - Backup (HydraCast)', serverName: 'Server 2 - Backup (HydraCast)', url: 'https://www.w3schools.com/html/movie.mp4', status: 'active', delay: '62ms' },
      { id: 'nexus-m3', name: 'Server 3 - Mirror (SFlix Cloud)', serverName: 'Server 3 - Mirror (SFlix Cloud)', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'warning', delay: '145ms' }
    ]
  },
  {
    id: 'silhouette-chronicles',
    title: 'Silhouette Chronicles',
    tagline: 'New Series — Now Streaming',
    description: 'In the shadows of a crumbling empire, seven strangers discover they share the same recurring nightmare — and that someone is hunting everyone who has had it.',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop',
    rating: 9.2,
    year: 2025,
    genre: ['Mystery', 'Thriller', 'Drama'],
    type: 'show',
    isOriginal: true,
    isTrending: true,
    views: 890420,
    mirrors: [],
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Undercurrents',
            duration: '48m',
            mirrors: [
              { id: 'sc-s1e1-m1', name: 'Server 1 - Primary', serverName: 'Server 1 - Primary', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active', delay: '18ms' },
              { id: 'sc-s1e1-m2', name: 'Server 2 - StarLink', serverName: 'Server 2 - StarLink', url: 'https://www.w3schools.com/html/movie.mp4', status: 'active', delay: '54ms' },
              { id: 'sc-s1e1-m3', name: 'Server 3 - Mirror', serverName: 'Server 3 - Mirror', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'dead', delay: 'timeout' }
            ]
          },
          {
            episodeNumber: 2,
            title: 'Seven Sleepless Minds',
            duration: '52m',
            mirrors: [
              { id: 'sc-s1e2-m1', name: 'Server 1 - Primary', serverName: 'Server 1 - Primary', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active', delay: '22ms' },
              { id: 'sc-s1e2-m2', name: 'Server 2 - StarLink', serverName: 'Server 2 - StarLink', url: 'https://www.w3schools.com/html/movie.mp4', status: 'active', delay: '41ms' }
            ]
          },
          {
            episodeNumber: 3,
            title: 'The Empire Sleeps',
            duration: '45m',
            mirrors: [
              { id: 'sc-s1e3-m1', name: 'Server 1 - Primary', serverName: 'Server 1 - Primary', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active', delay: '19ms' }
            ]
          },
          {
            episodeNumber: 4,
            title: 'Awake in Iron',
            duration: '51m',
            mirrors: [
              { id: 'sc-s1e4-m1', name: 'Server 1', serverName: 'Server 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }
            ]
          }
        ]
      },
      {
        seasonNumber: 2,
        episodes: [
          {
            episodeNumber: 1,
            title: 'The Reckoning Call',
            duration: '50m',
            mirrors: [
              { id: 'sc-s2e1-m1', name: 'Server 1 - Primary (VepCDN)', serverName: 'Server 1 - Primary (VepCDN)', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ether-drift',
    title: 'Ether Drift',
    description: 'High-speed anti-gravity racers compete in the hazardous vertical circuits of Neo-Tokyo. In this world, the drift is not just a style — it\'s an absolute survival necessity.',
    backdropUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    rating: 8.9,
    year: 2025,
    duration: '1h 54m',
    genre: ['Sci-Fi', 'Action'],
    type: 'movie',
    isTrending: true,
    views: 450100,
    mirrors: [
      { id: 'ed-m1', name: 'Server 1 (HighSpeed)', serverName: 'Server 1 (HighSpeed)', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' },
      { id: 'ed-m2', name: 'Server 2 (Backup)', serverName: 'Server 2 (Backup)', url: 'https://www.w3schools.com/html/movie.mp4', status: 'active' }
    ]
  },
  {
    id: 'the-obsidian-hour',
    title: 'The Highest Stakes',
    description: 'When a grand illusions team orchestrates history\'s most sophisticated underground casino heist, they find the cards are stacked against them in a high-stakes thriller where survival is the ultimate prize.',
    backdropUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop',
    rating: 9.3,
    year: 2025,
    duration: '2h 05m',
    genre: ['Thriller', 'Action', 'Mystery'],
    type: 'movie',
    isTrending: true,
    views: 312300,
    mirrors: [
      { id: 'toh-m1', name: 'Server 1 (CloudCast)', serverName: 'Server 1 (CloudCast)', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }
    ]
  },
  {
    id: 'carbon-saints',
    title: 'Carbon Saints',
    description: 'A mercenary faction tasked with defending the planet\'s last fossil fuel vault finds their primary core compromised by an eco-theocratic cult.',
    backdropUrl: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=600&auto=format&fit=crop',
    rating: 7.8,
    year: 2024,
    duration: '1h 48m',
    genre: ['Action', 'Thriller'],
    type: 'movie',
    isTrending: true,
    views: 189400,
    mirrors: [
      { id: 'cs-m1', name: 'Server 1', serverName: 'Server 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }
    ]
  },
  {
    id: 'pale-signal',
    title: 'Pale Signal',
    description: 'An arctic weather monitoring station begins accepting strange, rhythmic whispering radio waveforms emanating from the frozen permafrost of Siberia.',
    backdropUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600&auto=format&fit=crop',
    rating: 9.0,
    year: 2025,
    duration: '1h 37m',
    genre: ['Horror', 'Mystery'],
    type: 'movie',
    isTrending: true,
    views: 654000,
    mirrors: [
      { id: 'ps-m1', name: 'Server 1', serverName: 'Server 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' },
      { id: 'ps-m2', name: 'Server 2 (Broken)', serverName: 'Server 2 (Broken)', url: '', status: 'dead' }
    ]
  },
  {
    id: 'fracture-line',
    title: 'Fracture Line',
    description: 'A prominent judge in New York is blackmailed in a lethal scheme when her son is mysteriously framed for the brutal slaying of a city developer.',
    backdropUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop',
    rating: 8.1,
    year: 2024,
    duration: '2h 10m',
    genre: ['Drama', 'Thriller'],
    type: 'movie',
    isTrending: true,
    views: 231500,
    mirrors: [
      { id: 'fl-m1', name: 'Server 1', serverName: 'Server 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }
    ]
  },
  {
    id: 'umbra-protocol',
    title: 'Umbra Protocol',
    description: 'A tech firm designs an immersive interface capable of accessing user memory logs. When a testing engineer accesses his deceased wife\'s vault, the logs begin to mutate.',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    rating: 8.8,
    year: 2025,
    duration: '1h 59m',
    genre: ['Thriller', 'Sci-Fi'],
    type: 'movie',
    isOriginal: true,
    views: 512400,
    mirrors: [
      { id: 'up-m1', name: 'Server 1', serverName: 'Server 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }
    ]
  },
  {
    id: 'last-transmission',
    title: 'Last Transmission',
    description: 'On a solo colonization journey to Kepler-452b, the ship communication hub suffers an absolute structural failure. The pilot records her last transmission into the endless dark starfield.',
    backdropUrl: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=600&auto=format&fit=crop',
    rating: 9.1,
    year: 2025,
    duration: '2h 15m',
    genre: ['Sci-Fi', 'Drama'],
    type: 'movie',
    isOriginal: true,
    views: 432100,
    mirrors: [
      { id: 'lt-m1', name: 'Server 1', serverName: 'Server 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }
    ]
  },
  {
    id: 'neon-covenant',
    title: 'Neon Covenant',
    description: 'In an underground synth-goth society ruled by carbon cartridge syndicates, two rebellious low-lifes orchestrate a grand data heist that exposes the virtual city elders.',
    backdropUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=600&auto=format&fit=crop',
    rating: 8.5,
    year: 2024,
    genre: ['Neo-Noir', 'Sci-Fi'],
    type: 'show',
    isOriginal: true,
    views: 320500,
    mirrors: [],
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          { episodeNumber: 1, title: 'Carbon Genesis', duration: '44m', mirrors: [{ id: 'nc-e1-m1', name: 'Server 1', serverName: 'Server 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }] },
          { episodeNumber: 2, title: 'High Density Protocol', duration: '46m', mirrors: [{ id: 'nc-e2-m1', name: 'Server 1', serverName: 'Server 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }] }
        ]
      }
    ]
  },
  {
    id: 'axiom-divide',
    title: 'Axiom Divide',
    description: 'An high-level algorithmic equation calculates that human survival limits will expire by the turn of the decade. The world leaders must agree on an AI-supervised planetary divide.',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop',
    rating: 8.3,
    year: 2025,
    duration: '2h 02m',
    genre: ['Drama', 'Thriller'],
    type: 'movie',
    isOriginal: true,
    views: 198400,
    mirrors: [
      { id: 'ad-m1', name: 'Server 1', serverName: 'Server 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }
    ]
  },
  {
    id: 'the-hollow-meridian',
    title: 'The Hollow Meridian',
    description: 'Deep in the heart of Paris, an eccentric physicist discovers a cosmic wormhole stretching precisely down the prime meridian path of her tiny stone attic.',
    backdropUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?q=80&w=600&auto=format&fit=crop',
    rating: 8.6,
    year: 2023,
    duration: '1h 50m',
    genre: ['Drama', 'Mystery'],
    type: 'movie',
    views: 1420500,
    mirrors: [
      { id: 'thm-m1', name: 'Primary GlowCDN', serverName: 'Primary GlowCDN', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }
    ]
  },
  {
    id: 'coldwater-saints',
    title: 'Coldwater Saints',
    description: 'An ex-detective steps onto a remote, freezing Icelandic island after receiving an anonymous photograph suggesting his long-lost daughter is alive in a tight fishing sanctuary.',
    backdropUrl: 'https://images.unsplash.com/photo-1504893524553-ac55fce698be?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop',
    rating: 8.0,
    year: 2022,
    duration: '2h 12m',
    genre: ['Crime', 'Mystery', 'Drama'],
    type: 'movie',
    views: 654200,
    mirrors: [
      { id: 'cows-m1', name: 'Iceland FastCDN', serverName: 'Iceland FastCDN', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }
    ]
  },
  {
    id: 'nocturne-protocol',
    title: 'Nocturne Protocol',
    description: 'A cybersecurity expert discovers that every automated drone in Chicago is executing code routines pointing to a mythical underground controller called Nocturne.',
    backdropUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600&auto=format&fit=crop',
    rating: 8.3,
    year: 2024,
    duration: '1h 58m',
    genre: ['Thriller', 'Sci-Fi'],
    type: 'movie',
    views: 489000,
    mirrors: [
      { id: 'nop-m1', name: 'Central Cast CDN', serverName: 'Central Cast CDN', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }
    ]
  },
  {
    id: 'the-abyss-keepers',
    title: 'The Abyss Keepers',
    description: 'A futuristic submarine crew recovers an alien capsule 11,000 meters down. But as the capsule begins thawing inside the bay, the pressure within the sub rises.',
    backdropUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1629837547414-7507722d3b2e?q=80&w=600&auto=format&fit=crop',
    rating: 7.7,
    year: 2024,
    duration: '1h 45m',
    genre: ['Sci-Fi', 'Horror'],
    type: 'movie',
    views: 120500,
    mirrors: [
      { id: 'abk-m1', name: 'Deeper Server 1', serverName: 'Deeper Server 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }
    ]
  },
  {
    id: 'remnant-signal',
    title: 'Remnant Signal',
    description: 'An ancient satellite starts broadcasting signals that are perfectly encoded into 4K video feeds. Upon closer inspection, the clips reveal footage of the viewers themselves.',
    backdropUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=600&auto=format&fit=crop',
    rating: 8.9,
    year: 2023,
    duration: '1h 52m',
    genre: ['Horror', 'Mystery'],
    type: 'movie',
    views: 945000,
    mirrors: [
      { id: 'res-m1', name: 'Master Satellite Loop', serverName: 'Master Satellite Loop', url: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'active' }
    ]
  }
];
