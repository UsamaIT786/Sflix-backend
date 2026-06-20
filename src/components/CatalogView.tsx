import React, { useState, useEffect } from 'react';
import { MediaItem } from '../types';
import { GENRES, YEARS, SORTS } from '../data';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Grid, Archive, Sparkles, Filter, RefreshCw, X, Loader2 } from 'lucide-react';
import MediaCard from './MediaCard';

interface CatalogViewProps {
  mediaItems: MediaItem[];
  contentType: 'movie' | 'show' | 'all';
  onSelectMedia: (id: string) => void;
  initialGenre?: string;
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onFilterChange?: (filters: {
    searchQuery: string;
    genre: string;
    year: string;
    sort: string;
  }) => void;
}

export default function CatalogView({ 
  mediaItems, 
  contentType, 
  onSelectMedia,
  initialGenre, // Make this optional without default
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  onFilterChange
}: CatalogViewProps) {
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null); // Start with null
  const [selectedYear, setSelectedYear] = useState<string | null>(null); // Start with null
  const [selectedSort, setSelectedSort] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  // Sync initialGenre changes if any (e.g. from homepage browse genres)
  useEffect(() => {
    if (initialGenre) {
      setSelectedGenre(initialGenre);
    } else {
      setSelectedGenre(null);
    }
  }, [initialGenre]);

  // Notify parent of filter changes (but not searchQuery until search is triggered)
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        searchQuery: '', // Keep search query empty until search button/enter
        genre: selectedGenre || 'All', // Fallback to 'All' for TMDB call
        year: selectedYear || 'All', // Fallback to 'All' for TMDB call
        sort: selectedSort
      });
    }
  }, [selectedGenre, selectedYear, selectedSort, onFilterChange]);

  // Trigger search
  const handleSearch = () => {
    if (onFilterChange) {
      onFilterChange({
        searchQuery,
        genre: selectedGenre,
        year: selectedYear,
        sort: selectedSort
      });
    }
  };

  // Handle enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const viewTitle = contentType === 'movie' ? 'Movies Catalog' : contentType === 'show' ? 'TV Series Vault' : 'Discovery Core';
  const vSub = contentType === 'movie' ? 'Cinematic standalone films' : contentType === 'show' ? 'Original series & structured seasons' : 'Unified media catalogue';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedGenre(null);
    setSelectedYear(null);
    setSelectedSort('popular');
    if (onFilterChange) {
      onFilterChange({
        searchQuery: '',
        genre: 'All',
        year: 'All',
        sort: 'popular'
      });
    }
  };

  if (loading && mediaItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading media...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20" id="catalog-view-section">
      
      {/* 1. VIEW HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Secure Node Cluster</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
            {viewTitle}
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            {vSub} — Serve optimized via 40+ streaming mirrors
          </p>
        </div>

        {/* Results indicator */}
        <div className="text-xs font-mono text-slate-500 bg-slate-900 border border-white/5 rounded-lg px-3 py-1.5 self-start md:self-auto">
          AVAILABLE NODES: <span className="text-purple-400 font-bold">{mediaItems.length}</span>
        </div>
      </div>

      {/* 2. ADVANCED INTERACTIVE FILTER PANEL */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-white/5 mb-8 space-y-4" id="advanced-filters-panel">
        
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          
          <div className="relative w-full flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, description, casting variables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-20 py-3.5 rounded-xl text-white text-sm bg-slate-950/80 border border-white/5 focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 focus:outline-none transition-all placeholder:text-slate-500"
              id="catalog-search-input"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={handleSearch}
                className="p-1 text-cyan-400 hover:text-white"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
            {/* Quick Genre Chips directly accessible */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer w-full md:w-auto justify-center ${
                showFilters || selectedGenre || selectedYear
                  ? 'bg-purple-500/10 border-purple-500/30 text-cyan-400'
                  : 'bg-white/5 border-white/5 text-slate-300 hover:text-white hover:border-white/10'
              }`}
              id="toggle-filters-btn"
            >
              <Filter className="w-4 h-4" />
              <span>Advanced Filters</span>
              {selectedGenre || selectedYear ? (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              ) : null}
            </button>
            
            {/* Clear filters Button */}
            {(searchQuery || selectedGenre || selectedYear || selectedSort !== 'popular') && (
              <button
                onClick={resetAllFilters}
                className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Reset All Filters"
                id="reset-filters-btn"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Dropdowns Section */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5"
            id="expandable-filters-menu"
          >
            {/* Genre Selecting */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-slate-500">Genre Node</label>
              <select
                value={selectedGenre || ''}
                onChange={(e) => setSelectedGenre(e.target.value || null)}
                className="w-full text-sm rounded-lg py-2.5 px-3 bg-slate-950 border border-white/10 text-slate-300 focus:outline-none focus:border-purple-500"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g === 'All' ? '' : g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Year Selecting */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-slate-500">Year Released</label>
              <select
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(e.target.value || null)}
                className="w-full text-sm rounded-lg py-2.5 px-3 bg-slate-950 border border-white/10 text-slate-300 focus:outline-none focus:border-purple-500"
              >
                {YEARS.map((yr) => (
                  <option key={yr} value={yr === 'All' ? '' : yr}>{yr === 'All' ? 'All Years' : yr}</option>
                ))}
              </select>
            </div>

            {/* Category sorting selectors */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-slate-500">Sort Priority</label>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full text-sm rounded-lg py-2.5 px-3 bg-slate-950 border border-white/10 text-slate-300 focus:outline-none focus:border-purple-500"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

          </motion.div>
        )}

        {/* Selected parameters badges */}
        {(selectedGenre || selectedYear) && (
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-[10px] text-slate-500 font-mono tracking-wider">Active Filters:</span>
            {selectedGenre && (
              <span className="inline-flex items-center gap-1 bg-purple-500/5 border border-purple-500/20 text-xs px-2.5 py-1 rounded-full text-cyan-400">
                Genre: {selectedGenre}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedGenre(null)} />
              </span>
            )}
            {selectedYear && (
              <span className="inline-flex items-center gap-1 bg-purple-500/5 border border-purple-500/20 text-xs px-2.5 py-1 rounded-full text-cyan-400">
                Year: {selectedYear}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedYear(null)} />
              </span>
            )}
          </div>
        )}

      </div>


      {/* 3. CATALOG GRID VIEW */}
      {mediaItems.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8" id="catalog-cards-grid">
            {mediaItems.map((item) => (
              <div key={item.id} className="flex justify-center" id={`catalog-card-container-${item.id}`}>
                <MediaCard item={item} onSelect={onSelectMedia} />
              </div>
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMore && onLoadMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-white bg-gradient-to-r from-purple-600 via-indigo-650 to-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold tracking-widest text-xs uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading More...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Content</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        /* No results state */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 bg-slate-900/10 rounded-3xl border border-white/5 text-center px-4"
          id="no-catalog-results-card"
        >
          <div className="w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center border border-white/5 mb-4 text-purple-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-display font-medium text-white uppercase tracking-wide">
            No Results Found
          </h3>
          <p className="text-sm text-slate-400 mt-2 max-w-sm">
            Try adjusting your filters or search query to find what you're looking for.
          </p>
          
          <button
            onClick={resetAllFilters}
            className="mt-6 px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-xs font-bold text-white transition-all cursor-pointer uppercase tracking-wider"
          >
            Reset All Filters
          </button>
        </motion.div>
      )}

    </div>
  );
}
