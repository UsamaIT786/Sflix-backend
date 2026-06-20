import React, { useState, useEffect } from 'react';
import { MediaItem } from '../types';
import { BRAND_NAME, SUBSCRIPTION_PLANS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, Info, Star, ChevronRight, Sparkles, Check, Zap } from 'lucide-react';
import MediaCard from './MediaCard';

interface HomeViewProps {
  mediaItems: MediaItem[];
  onSelectMedia: (id: string) => void;
  onGenreSelect: (genre: string) => void;
  onWatchlistAdd: (id: string) => void;
  watchlist: string[];
  onPricingClick?: () => void;
}

export default function HomeView({ 
  mediaItems, 
  onSelectMedia, 
  onGenreSelect, 
  onWatchlistAdd,
  watchlist,
  onPricingClick
}: HomeViewProps) {
  
  // Split media into categories
  const trendingNow = mediaItems;
  const originals = mediaItems.filter(item => item.isOriginal);
  const movies = mediaItems.filter(item => item.type === 'movie');
  const shows = mediaItems.filter(item => item.type === 'show');

  // Use first 5 items for hero slider
  const slides = mediaItems.slice(0, 5);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Automatic transition loops of 6.5 seconds
  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }, 6500);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const featuredItem = slides.length > 0 ? slides[currentSlideIndex] : null;

  // Spectacular display title rendering engine with stylized last word glow
  const renderTitle = (title: string) => {
    const words = title.split(' ');
    if (words.length <= 1) {
      return <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">{title}</span>;
    }
    const mainPart = words.slice(0, -1).join(' ');
    const lastWord = words[words.length - 1];
    return (
      <>
        {mainPart} <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">{lastWord}</span>
      </>
    );
  };

  const genresList = [
    { name: 'Sci-Fi', count: '1000+ titles', icon: '✦', color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400' },
    { name: 'Thriller', count: '800+ titles', icon: '◈', color: 'from-purple-500/20 to-indigo-500/20 text-purple-400' },
    { name: 'Action', count: '1500+ titles', icon: '❂', color: 'from-blue-500/20 to-cyan-500/20 text-cyan-350' },
    { name: 'Comedy', count: '1200+ titles', icon: '◰', color: 'from-indigo-500/20 to-purple-500/20 text-indigo-400' },
    { name: 'Horror', count: '600+ titles', icon: '♠', color: 'from-purple-550/20 to-slate-900/20 text-purple-300' },
    { name: 'Drama', count: '900+ titles', icon: '✿', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400' },
    { name: 'Documentary', count: '400+ titles', icon: '⧇', color: 'from-cyan-500/20 to-purple-500/20 text-cyan-400' },
    { name: 'Animation', count: '500+ titles', icon: '◆', color: 'from-purple-500/20 to-pink-500/20 text-pink-400' }
  ];

  if (mediaItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading movies and shows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-16 pb-24" id="home-view-container">
      
      {/* 1. CINEMATIC ROTATING HERO BANNERS */}
      {featuredItem && (
        <div className="relative w-full min-h-[90vh] flex items-center justify-start overflow-hidden pt-20" id="hero-banner-section">
          
          {/* Animated Background Backdrop */}
          <div className="absolute inset-0 z-0 select-none bg-slate-950">
            <AnimatePresence mode="wait">
              <motion.img 
                key={featuredItem.id + '-backdrop'}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                src={featuredItem.backdropUrl} 
                alt={featuredItem.title} 
                className="absolute inset-0 w-full h-full object-cover object-top filter brightness-50 contrast-[1.05]"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            {/* Overlay Filters */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-transparent z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040407] via-[#040407]/45 to-transparent z-[1]" />
          </div>

          {/* Content Box Overlay */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-12 mb-16">
            <AnimatePresence mode="wait">
              <motion.div 
                key={featuredItem.id + '-content'}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -22 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="max-w-2xl space-y-6"
              >
                
                {/* Tagline Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/35 text-[11px] font-bold font-mono tracking-widest text-purple-400">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Tonight's Spotlight</span>
                  <span className="text-white/30 font-normal">•</span>
                  <span className="flex items-center gap-0.5 text-white bg-slate-950/80 px-2 py-0.5 rounded-full text-[10px] border border-white/5">
                    <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                    {featuredItem.rating} Rating
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tight leading-[0.95] text-white uppercase drop-shadow-xl select-none">
                  {renderTitle(featuredItem.title)}
                </h1>

                {/* Metadata Line */}
                <p className="text-xs sm:text-sm font-mono tracking-wide text-cyan-300/90 font-semibold flex items-center gap-x-2 gap-y-1 flex-wrap">
                  <span>{featuredItem.genre.join('  |  ')}</span>
                  <span className="text-white/20">•</span>
                  <span>{featuredItem.year}</span>
                  <span className="text-white/20">•</span>
                  <span className="bg-slate-950 px-2.5 py-0.5 rounded border border-white/10 text-white font-mono text-[10px] uppercase font-bold">
                    {featuredItem.type === 'movie' ? 'Movie' : 'TV Show'}
                  </span>
                </p>

                {/* Description */}
                <p className="text-base text-slate-300 leading-relaxed font-sans max-w-xl">
                  {featuredItem.description}
                </p>

                {/* Play Actions */}
                <div className="flex items-center gap-4 flex-wrap pt-3">
                  <button 
                    onClick={() => onSelectMedia(featuredItem.id)}
                    className="group/btn flex items-center gap-4 px-8 py-4.5 rounded-2xl text-white bg-gradient-to-r from-purple-600 via-indigo-650 to-blue-500 hover:scale-[1.04] active:scale-[0.96] transition-all duration-300 font-bold tracking-widest text-xs uppercase cursor-pointer"
                  >
                    <div className="w-6.5 h-6.5 rounded-full bg-slate-950 flex items-center justify-center text-cyan-400 pl-0.5 group-hover/btn:bg-white group-hover/btn:text-slate-950 transition-colors">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span>PLAY NOW</span>
                  </button>

                  <button 
                    onClick={() => onWatchlistAdd(featuredItem.id)}
                    className={`flex items-center gap-2 px-6 py-4.5 rounded-2xl text-xs font-bold border transition-all duration-300 backdrop-blur-md cursor-pointer tracking-wider ${
                      watchlist.includes(featuredItem.id)
                        ? 'bg-purple-500/10 border-purple-500/60 text-cyan-400'
                        : 'bg-white/5 hover:bg-white/15 border-white/10 text-white hover:border-white/25'
                    }`}
                  >
                    <Plus className={`w-4 h-4 ${watchlist.includes(featuredItem.id) ? 'rotate-45' : ''} transition-transform`} />
                    {watchlist.includes(featuredItem.id) ? 'IN WATCHLIST' : 'ADD TO LIST'}
                  </button>

                  <button 
                    onClick={() => onSelectMedia(featuredItem.id)}
                    className="p-4 rounded-2xl border border-white/10 text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-950/70 transition-all cursor-pointer"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#040407] to-transparent pointer-events-none z-[2]" />
        </div>
      )}


      {/* 2. TRENDING NOW CAROUSEL */}
      {trendingNow.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="trending-section">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-cyan-400 rounded-full" />
              <h2 className="text-xl sm:text-2xl font-display font-medium text-white tracking-wide uppercase">
                Trending Now
              </h2>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x scroll-smooth">
            {trendingNow.map((item) => (
              <div key={item.id} className="snap-start">
                <MediaCard item={item} onSelect={onSelectMedia} />
              </div>
            ))}
          </div>
        </div>
      )}


      {/* 3. MOVIES SECTION */}
      {movies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="movies-section">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full" />
              <h2 className="text-xl sm:text-2xl font-display font-medium text-white tracking-wide uppercase">
                Trending Movies
              </h2>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x scroll-smooth">
            {movies.map((item) => (
              <div key={item.id} className="snap-start">
                <MediaCard item={item} onSelect={onSelectMedia} />
              </div>
            ))}
          </div>
        </div>
      )}


      {/* 4. TV SHOWS SECTION */}
      {shows.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="shows-section">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
              <h2 className="text-xl sm:text-2xl font-display font-medium text-white tracking-wide uppercase">
                Trending TV Shows
              </h2>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x scroll-smooth">
            {shows.map((item) => (
              <div key={item.id} className="snap-start">
                <MediaCard item={item} onSelect={onSelectMedia} />
              </div>
            ))}
          </div>
        </div>
      )}


      {/* 5. BROWSE BY GENRE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="browse-genres-grid-section">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-display font-medium text-white tracking-wide uppercase">
              Browse By Genre
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {genresList.map((gDef) => (
            <button
              key={gDef.name}
              onClick={() => onGenreSelect(gDef.name)}
              className="relative overflow-hidden rounded-xl p-5 text-left border border-white/5 bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xl group-hover:scale-125 transition-transform duration-300 font-mono">
                  {gDef.icon}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{gDef.count}</span>
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">
                {gDef.name}
              </h3>
              <p className="text-[10px] text-slate-500 uppercase font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Stream &rarr;
              </p>
            </button>
          ))}
        </div>
      </div>


      {/* 6. PREMIUM CINEMATIC PRICING SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="relative rounded-3xl overflow-hidden bg-slate-950/40 border border-white/5 p-8 sm:p-12 lg:p-16 backdrop-blur-md">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            <div className="lg:col-span-4 w-full flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-950/25">
                <img 
                  src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=700&auto=format&fit=crop" 
                  alt="Premium" 
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col justify-center">
              <div className="mb-6 text-center lg:text-left">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 font-extrabold mb-3 block">
                  Simple Pricing
                </span>
                <h2 className="text-3xl sm:text-5xl font-display font-medium text-white tracking-tight leading-tight">
                  One Plan. Everything.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mt-8">
                {(() => {
                  const displayPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'free-trial') || SUBSCRIPTION_PLANS[0];
                  return (
                    <>
                      <div className="md:col-span-6 rounded-2xl bg-slate-950/85 border border-white/15 p-6 flex flex-col justify-between items-center text-center shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080c14_1px,transparent_1px),linear-gradient(to_bottom,#080c14_1px,transparent_1px)] bg-[size:14px_24px] opacity-10" />
                        
                        <div className="relative z-10 w-full flex flex-col items-center">
                          <div className="w-14 h-14 rounded-full bg-slate-900 border border-purple-500/30 shadow-md shadow-purple-500/5 flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-cyan-400" />
                          </div>

                          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-3 block">
                            {displayPlan.name}
                          </span>

                          <div className="flex items-start justify-center text-white mb-2">
                            <span className="text-3.5xl font-bold font-sans mt-2 mr-0.5">$</span>
                            <span className="text-7xl font-extrabold font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400">{displayPlan.price.split('.')[0]}</span>
                            <span className="text-3.5xl font-bold font-sans mt-2">.{displayPlan.price.split('.')[1]}</span>
                          </div>

                          <span className="text-xs text-slate-500 font-medium mb-6">
                            {displayPlan.period}
                          </span>
                        </div>

                        <div className="relative z-10 w-full">
                          <button 
                            onClick={onPricingClick}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition-all duration-300 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-purple-500/15 cursor-pointer active:scale-95"
                          >
                            {displayPlan.buttonText}
                          </button>
                          <span className="text-[10px] text-cyan-400 tracking-wider text-center block mt-3 font-mono font-bold">
                            3-DAY FREE TRIAL
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-6 flex flex-col justify-center space-y-3.5 pl-0 md:pl-4">
                        {displayPlan.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-purple-500/10 border border-purple-400/30 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3.5 h-3.5 text-cyan-400" />
                            </div>
                            <span className="text-sm text-slate-300 font-sans tracking-wide">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}