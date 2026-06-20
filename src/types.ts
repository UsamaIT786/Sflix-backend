export interface Mirror {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'dead' | 'warning';
  delay?: string;
}

export interface Episode {
  episodeNumber: number;
  title: string;
  duration: string;
  mirrors: Mirror[];
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

// TMDB Types
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  media_type?: 'movie';
}

export interface TMDBTV {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
  media_type?: 'tv';
}

export type TMDBMedia = TMDBMovie | TMDBTV;

export interface TMDBTrendingResponse {
  page: number;
  results: TMDBMedia[];
  total_pages: number;
  total_results: number;
}

// App Media Item
export interface MediaItem {
  id: string;
  tmdbId: number;
  title: string;
  description: string;
  backdropUrl: string;
  posterUrl: string;
  rating: number;
  year: number;
  duration?: string; // e.g. "2h 18m"
  genre: string[];
  type: 'movie' | 'show';
  isTrending?: boolean;
  isOriginal?: boolean;
  isFeatured?: boolean;
  views?: number;
  tagline?: string;
  mirrors: Mirror[];
  seasons?: Season[];
}

export type ActivePage = 'home' | 'movies' | 'tv-shows' | 'player' | 'vip' | 'admin-portal' | 'login' | 'register' | 'welcome';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  borderColor?: string;
  glowColor?: string;
  buttonText: string;
}

export interface AppState {
  currentPage: ActivePage;
  selectedMediaId: string | null;
  selectedSeason: number;
  selectedEpisode: number;
  searchQuery: string;
  selectedGenre: string;
  selectedYear: string;
  selectedSort: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  isVip?: boolean;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: Date;
  photoUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Payment Types
export interface TransactionDetails {
  id: string;
  amount: string;
  currency: string;
  cardLast4?: string;
  cardBrand?: string;
  planId: string;
  planName: string;
}

export interface ChargeRequest {
  paymentToken: string;
  planId: string;
  planName: string;
  planPrice: string;
  userId?: string;
}

export interface ChargeResponse {
  success: boolean;
  message: string;
  transaction?: TransactionDetails;
  errorCode?: string;
}
