/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ActivePage, MediaItem, TMDBMedia, User } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import CatalogView from './components/CatalogView';
import PlayerView from './components/PlayerView';
import VipView from './components/VipView';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import { auth } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// TMDB Genre ID Mapping
const TMDB_GENRE_MAP: Record<string, { movie: number; tv: number }> = {
  'Action': { movie: 28, tv: 10759 },
  'Comedy': { movie: 35, tv: 35 },
  'Drama': { movie: 18, tv: 18 },
  'Thriller': { movie: 53, tv: 53 },
  'Sci-Fi': { movie: 878, tv: 10765 },
  'Horror': { movie: 27, tv: 27 },
  'Documentary': { movie: 99, tv: 99 },
  'Animation': { movie: 16, tv: 16 },
  'Crime': { movie: 80, tv: 80 },
  'Mystery': { movie: 9648, tv: 9648 },
  'Neo-Noir': { movie: 18, tv: 18 }, // Map to Drama since TMDB doesn't have Neo-Noir
};

// Runtime validation of environment variables
const TMDB_TOKEN = import.meta.env.VITE_TMDB_API_KEY || "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZTM4ZmZmZWQ4ZTk2YTc2ODQwNjliYjNhY2MxYWNkNCIsIm5iZiI6MTc4MTY5MDMwNi43OTgsInN1YiI6IjZhMzI2ZmMyZDUyYzY0OTYzYWQzOTAwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3k8r-TOzjeqNsmgQ9SAyXEseu_AQ0TCAQj6muZu_BO0";

if (!TMDB_TOKEN || TMDB_TOKEN.includes("YOUR")) {
  console.error("CRITICAL: TMDB Token is missing or invalid in current environment execution context.");
}

// Helper to fetch from TMDB API
const fetchFromTMDB = async (endpoint: string, params: Record<string, string | number> = {}) => {
  if (!TMDB_TOKEN || TMDB_TOKEN.includes("YOUR")) {
    throw new Error("TMDB Token is not configured in environment variables.");
  }

  const url = new URL(`${import.meta.env.VITE_TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('language', 'en-US');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  
  console.log('Fetching from TMDB:', url.toString());
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('TMDB API Error Response:', errorText);
    throw new Error(`TMDB API request failed: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log('TMDB API Response Data:', data);
  return data;
};

// Framer Motion core transitions
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star } from 'lucide-react';

// Helper function to convert TMDB media to app MediaItem
const tmdbToMediaItem = (tmdbMedia: TMDBMedia): MediaItem => {
  const isMovie = 'title' in tmdbMedia;
  const title = isMovie ? tmdbMedia.title : tmdbMedia.name;
  const date = isMovie ? tmdbMedia.release_date : tmdbMedia.first_air_date;
  const year = date ? new Date(date).getFullYear() : 2024;
  
  const posterUrl = tmdbMedia.poster_path 
    ? `https://image.tmdb.org/t/p/w500${tmdbMedia.poster_path}` 
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop';
  
  const backdropUrl = tmdbMedia.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${tmdbMedia.backdrop_path}` 
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop';

  // Map genre IDs to names (simplified for now)
  const genreNames: Record<number, string> = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
    10759: 'Action & Adventure',
    10762: 'Kids',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics'
  };

  const genres = tmdbMedia.genre_ids?.map(id => genreNames[id] || 'Drama') || ['Drama'];

  return {
    id: `tmdb-${tmdbMedia.id}`,
    tmdbId: tmdbMedia.id,
    title,
    description: tmdbMedia.overview || 'No description available',
    backdropUrl,
    posterUrl,
    rating: Math.round(tmdbMedia.vote_average * 10) / 10,
    year,
    genre: genres,
    type: isMovie ? 'movie' : 'show',
    isTrending: true,
    isOriginal: Math.random() > 0.7,
    mirrors: [
      { id: 'server-1', name: 'Server 1', url: 'https://example.com', status: 'active' },
      { id: 'server-2', name: 'Server 2', url: 'https://example.com', status: 'active' }
    ]
  };
};

const convertFirebaseUser = (user: FirebaseUser): User => {
  return {
    id: user.uid,
    email: user.email || '',
    username: user.displayName || user.email?.split('@')[0] || 'User',
    createdAt: new Date(user.metadata.creationTime || Date.now()),
    photoUrl: user.photoURL || undefined,
    isVip: false,
  };
};

export default function App() {
  // Page Navigation State
  const [currentPage, setCurrentPage] = useState<ActivePage>('home');
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Media State
  const [homeMediaItems, setHomeMediaItems] = useState<MediaItem[]>([]);
  const [catalogMediaItems, setCatalogMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Catalog Filter State
  const [catalogFilters, setCatalogFilters] = useState({
    searchQuery: '',
    genre: 'All',
    year: 'All',
    sort: 'popular'
  });

  // Genre browsing state
  const [currentGenre, setCurrentGenre] = useState<string | null>(null);
  const [homeGenreFilterPreselect, setHomeGenreFilterPreselect] = useState<string | null>(null);

  // VIP & Watchlists local state triggers
  const [isVIPUser, setIsVIPUser] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  
  // Quick Search Overlay state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Check for admin-panel path and auth state on mount
  useEffect(() => {
    // Check for /admin-panel path first
    const pathname = window.location.pathname;
    if (pathname === '/admin-panel') {
      setCurrentPage('admin-portal');
      setAuthLoading(false);
      return;
    }

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const convertedUser = convertFirebaseUser(user);
        setAuthUser(convertedUser);
        setIsAuthenticated(true);
        // Check if user has VIP status stored locally
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.isVip) {
            setIsVIPUser(true);
          }
        }
      } else {
          setAuthUser(null);
          setIsAuthenticated(false);
          setIsVIPUser(false);
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch home media (trending all)
  useEffect(() => {
    const fetchHomeMedia = async () => {
      try {
        const data = await fetchFromTMDB('/trending/all/week');
        if (data.results) {
          const converted = data.results.map(tmdbToMediaItem);
          setHomeMediaItems(converted);
        } else {
          throw new Error("TMDB API returned no results.");
        }
      } catch (error) {
        console.error('Error fetching home media:', error);
        setHomeMediaItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeMedia();
  }, []);

  // Fetch catalog media when filters change or page changes
  const fetchCatalogMedia = useCallback(async (page: number = 1, append: boolean = false) => {
    if (currentPage !== 'movies' && currentPage !== 'tv-shows') return;
    
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setCatalogMediaItems([]);
      }

      const contentType = currentPage === 'movies' ? 'movie' : 'tv';
      let data;

      // Check if search query is present (including 4-digit year)
      const isYearQuery = /^\d{4}$/.test(catalogFilters.searchQuery.trim());
      
      if (catalogFilters.searchQuery.trim() && !isYearQuery) {
        // Use search endpoint for text search
        const params: Record<string, string | number> = { 
          query: catalogFilters.searchQuery.trim(),
          page
        };
        data = await fetchFromTMDB(`/search/${contentType}`, params);
      } else {
        // Use discover endpoint for filters and year search
        const params: Record<string, string | number> = { page };
        
        if (catalogFilters.genre !== 'All') {
          const genreIds = TMDB_GENRE_MAP[catalogFilters.genre];
          if (genreIds) {
            params.with_genres = genreIds[contentType];
          }
        }
        
        // Check if search query is a 4-digit year
        const yearFilter = isYearQuery ? catalogFilters.searchQuery.trim() : catalogFilters.year;
        if (yearFilter !== 'All') {
          if (contentType === 'movie') {
            params.primary_release_year = yearFilter;
          } else {
            params.first_air_date_year = yearFilter;
          }
        }
        
        if (catalogFilters.sort === 'top-rated') {
          params.sort_by = 'vote_average.desc';
          params['vote_count.gte'] = 100;
        } else if (catalogFilters.sort === 'newest') {
          params.sort_by = contentType === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc';
        } else {
          params.sort_by = 'popularity.desc';
        }

        data = await fetchFromTMDB(`/discover/${contentType}`, params);
      }

      if (data.results) {
        const converted = data.results.map(tmdbToMediaItem);
        if (append) {
          setCatalogMediaItems(prev => [...prev, ...converted]);
        } else {
          setCatalogMediaItems(converted);
        }
        setCurrentPageNum(data.page);
        setTotalPages(data.total_pages);
      } else {
        throw new Error("TMDB API returned no results.");
      }
    } catch (error) {
      console.error('Error fetching catalog media:', error);
      if (!append) {
        setCatalogMediaItems([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentPage, catalogFilters]);

  // Fetch catalog media when page or filters change
  useEffect(() => {
    fetchCatalogMedia(1, false);
  }, [fetchCatalogMedia]);

  // Load more catalog media
  const handleLoadMore = useCallback(async () => {
    if (currentPageNum < totalPages && !loadingMore) {
      await fetchCatalogMedia(currentPageNum + 1, true);
    }
  }, [currentPageNum, totalPages, loadingMore, fetchCatalogMedia]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: typeof catalogFilters) => {
    setCatalogFilters(newFilters);
  }, []);

  // Auth handlers
  const handleLoginSuccess = (user: User, token: string) => {
    setAuthUser(user);
    setIsAuthenticated(true);
    setIsVIPUser(!!user.isVip);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    await auth.signOut();
    setAuthUser(null);
    setIsAuthenticated(false);
    setIsVIPUser(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setCurrentPage('login');
  };

  const handleRegisterSuccess = () => {
    setCurrentPage('login');
  };

  // Select media to trigger the player view
  const handleSelectMedia = (id: string) => {
    setSelectedMediaId(id);
    setCurrentPage('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add/Remove from Watchlist toggler
  const handleWatchlistToggle = (id: string) => {
    if (watchlist.includes(id)) {
      setWatchlist(watchlist.filter(item => item !== id));
    } else {
      setWatchlist([...watchlist, id]);
    }
  };

  // Genre selected on landing hub redirections
  const handleHomepageGenreSelection = (genre: string) => {
    setCurrentGenre(null);
    setHomeGenreFilterPreselect(null);
    setCatalogFilters(prev => ({ ...prev, genre: 'All' }));
    setCurrentPage('movies'); // default to movies, user can switch to TV
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // VIP plan selection
  const [initialVipPlanId, setInitialVipPlanId] = useState<string | undefined>();
  
  // Page switching wrapper
  const handlePageChange = (page: ActivePage, options?: { initialVipPlanId?: string }) => {
    // Only reset genre if not switching between movies/tv-shows
    if (page !== 'movies' && page !== 'tv-shows') {
      setCurrentGenre(null);
      setHomeGenreFilterPreselect(null);
      setCatalogFilters(prev => ({ ...prev, genre: 'All' }));
    }
    // If unauthenticated and trying to access VIP, send to login first
    if (page === 'vip' && !isAuthenticated) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
    if (options?.initialVipPlanId) {
      setInitialVipPlanId(options.initialVipPlanId);
    } else {
      setInitialVipPlanId(undefined);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpgradeSuccess = () => {
    setIsVIPUser(true);
    if (authUser) {
      const updatedUser = { ...authUser, isVip: true };
      setAuthUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  const handleCancelSubscription = () => {
    setIsVIPUser(false);
    if (authUser) {
      const updatedUser = { ...authUser, isVip: false };
      setAuthUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  // Real-time Global Search Overlay matches
  const matchedQuickMedia = globalSearchQuery.trim()
    ? homeMediaItems.filter((m) => {
        const trimmedQuery = globalSearchQuery.trim();
        const isYearQuery = /^\d{4}$/.test(trimmedQuery);
        if (isYearQuery) {
          return m.year.toString() === trimmedQuery;
        }
        const query = trimmedQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(query) ||
          m.genre.some((g) => g.toLowerCase().includes(query)) ||
          m.description.toLowerCase().includes(query)
        );
      })
    : [];

  // Active Selected item resolution
  const allMediaItems = [...homeMediaItems, ...catalogMediaItems];
  const activeMediaItem = allMediaItems.find(item => item.id === selectedMediaId);

  // Show loading state while checking auth removed so Home page loads immediately

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#040407] selection:bg-amber-400 selection:text-slate-900" id="sflix-root-node">
      {/* Always show navbar unless on login/register or admin-portal without auth */}
      {currentPage !== 'login' && currentPage !== 'register' && !(currentPage === 'admin-portal' && !isAuthenticated) && (
        <Navbar 
          currentPage={currentPage} 
          onPageChange={handlePageChange} 
          onSearchToggle={() => setIsSearchOpen(true)}
          isVIPUser={isVIPUser}
          isAuthenticated={isAuthenticated}
          authUser={authUser}
          onLogout={handleLogout}
          onCancelSubscription={handleCancelSubscription}
        />
      )}

      {/* Grid cyber lighting effects */}
      {currentPage !== 'login' && currentPage !== 'register' && (
        <>
          <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-amber-400/5 via-transparent to-transparent pointer-events-none z-0" />
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />
        </>
      )}

      {/* 2. DYNAMIC CONTENT VIEWS PORT */}
      <main className={`flex-grow z-10 ${(currentPage === 'login' || currentPage === 'register') ? 'pt-20' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (selectedMediaId || '')}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            id={`view-wrapper-${currentPage}`}
          >
            {currentPage === 'home' && (
              <HomeView 
                mediaItems={homeMediaItems}
                onSelectMedia={handleSelectMedia}
                onGenreSelect={handleHomepageGenreSelection}
                onWatchlistAdd={handleWatchlistToggle}
                watchlist={watchlist}
                onPricingClick={() => handlePageChange('vip', { initialVipPlanId: 'free-trial' })}
              />
            )}

            {currentPage === 'movies' && (
              <CatalogView 
                mediaItems={catalogMediaItems}
                contentType="movie"
                onSelectMedia={handleSelectMedia}
                initialGenre={homeGenreFilterPreselect}
                loading={loading}
                loadingMore={loadingMore}
                hasMore={currentPageNum < totalPages}
                onLoadMore={handleLoadMore}
                onFilterChange={handleFilterChange}
              />
            )}

            {currentPage === 'tv-shows' && (
              <CatalogView 
                mediaItems={catalogMediaItems}
                contentType="show"
                onSelectMedia={handleSelectMedia}
                initialGenre={homeGenreFilterPreselect}
                loading={loading}
                loadingMore={loadingMore}
                hasMore={currentPageNum < totalPages}
                onLoadMore={handleLoadMore}
                onFilterChange={handleFilterChange}
              />
            )}

            {currentPage === 'player' && activeMediaItem && (
              <PlayerView 
                item={activeMediaItem}
                onBackToDiscovery={() => {
                  setSelectedMediaId(null);
                  setCurrentPage('home');
                }}
                onSelectMedia={handleSelectMedia}
                allMedia={allMediaItems}
              />
            )}

            {currentPage === 'vip' && (
              <VipView 
                onUpgradeSuccess={handleUpgradeSuccess}
                isVIPUser={isVIPUser}
                user={authUser}
                initialSelectedPlanId={initialVipPlanId}
              />
            )}

            {currentPage === 'admin-portal' && (
              <AdminView 
                mediaItems={allMediaItems}
                onUpdateMediaItems={setHomeMediaItems}
              />
            )}

            {currentPage === 'login' && (
              <LoginView 
                onBackToHome={() => setCurrentPage('home')}
                onLoginSuccess={handleLoginSuccess}
                onSwitchToRegister={() => setCurrentPage('register')}
              />
            )}

            {currentPage === 'register' && (
              <RegisterView 
                onBackToHome={() => setCurrentPage('home')}
                onRegisterSuccess={handleRegisterSuccess}
                onSwitchToLogin={() => setCurrentPage('login')}
                onLoginSuccess={handleLoginSuccess}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. PREMIUM GLOBAL FOOTER */}
      {currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'admin-portal' && <Footer />}

      {/* 4. IMMERSIVE COMPACT GLOBAL QUICK SEARCH PORTAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-slate-950/90 backdrop-blur-xl" id="global-quick-search-portal">
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden shadow-2xl mt-20 relative"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3 w-full">
                  <Search className="w-5 h-5 text-cyan-400 flex-shrink-0 animate-pulse" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Quick Search mirror catalogs..."
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-white border-none outline-none text-sm font-sans placeholder:text-slate-500"
                    id="global-search-portal-input"
                  />
                </div>
                
                <button 
                  onClick={() => {
                    setIsSearchOpen(false);
                    setGlobalSearchQuery('');
                  }}
                  className="p-1 px-3 text-xs bg-white/5 text-slate-400 hover:text-white rounded"
                  id="close-portal-search-btn"
                >
                  ✕
                </button>
              </div>

              {/* Match listing body */}
              <div className="max-h-[350px] overflow-y-auto p-4 custom-scrollbar space-y-3">
                {globalSearchQuery.trim() ? (
                  matchedQuickMedia.length > 0 ? (
                    matchedQuickMedia.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          handleSelectMedia(m.id);
                          setIsSearchOpen(false);
                          setGlobalSearchQuery('');
                        }}
                        className="flex gap-4 p-2 bg-slate-950/40 hover:bg-slate-950 hover:border-purple-500/30 rounded-xl border border-white/5 cursor-pointer transition"
                      >
                        <img 
                          src={m.posterUrl} 
                          alt={m.title} 
                          className="w-12 h-16 rounded-md object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col justify-center min-w-0">
                          <span className="text-[10px] text-cyan-400 font-mono tracking-wider flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-cyan-400" />
                            {m.rating} Rating
                          </span>
                          <h4 className="text-xs font-bold text-white uppercase mt-0.5">{m.title}</h4>
                          <span className="text-[9px] text-slate-500 font-mono mt-0.5">Released {m.year} • {m.genre.join(', ')}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs font-mono">
                      No matching media nodes located in cache.
                    </div>
                  )
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    Type title tags (such as <span className="text-cyan-400 font-mono">"Protocol"</span>, <span className="text-cyan-400 font-mono">"Saints"</span> or <span className="text-cyan-400 font-mono">"Sci-Fi"</span>) to filter channels immediately.
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
