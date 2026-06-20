import React from 'react';
import { MediaItem } from '../types';
import { motion } from 'motion/react';
import { Play, Star, Sparkles, Tv, Clapperboard } from 'lucide-react';
import PremiumPlayIcon from './PremiumPlayIcon';

interface MediaCardProps {
  item: MediaItem;
  onSelect: (id: string) => void;
  variant?: 'standard' | 'original' | 'horizontal';
}

export default function MediaCard({ item, onSelect, variant = 'standard' }: MediaCardProps) {
  
  if (variant === 'horizontal') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02 }}
        onClick={() => onSelect(item.id)}
        className="flex gap-4 p-3 rounded-xl bg-slate-900/30 hover:bg-slate-900/60 border border-white/5 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group"
      >
        <div className="w-20 h-28 rounded-lg overflow-hidden relative flex-shrink-0">
          <img 
            src={item.posterUrl} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
              <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
              {item.rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-450 font-mono">{item.year}</span>
          </div>
          <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
            {item.title}
          </h4>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
            {item.description}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onSelect(item.id)}
      className="relative flex-shrink-0 w-[190px] h-[280px] sm:w-[220px] sm:h-[320px] rounded-2xl overflow-hidden glass-card cursor-pointer group shadow-lg hover:shadow-purple-500/10 border border-white/5 hover:border-cyan-400/30"
    >
      {/* Background Poster Image */}
      <img
        src={item.posterUrl}
        alt={item.title}
        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        loading="lazy"
        referrerPolicy="no-referrer"
      />

      {/* Glass & Shadow Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/40 transition-colors duration-300" />

      {/* Badges Overlay at Top Left/Right */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
        
        {/* Dynamic Badge Type */}
        {item.isOriginal ? (
          <span className="flex items-center gap-1 text-[10px] tracking-wider font-display font-bold bg-purple-600/95 text-white px-2 py-0.5 rounded-md shadow-md shadow-purple-900/50 backdrop-blur-sm border border-purple-400/20">
            ORIGINAL
          </span>
        ) : item.isTrending ? (
          <span className="flex items-center gap-1 text-[10px] tracking-wider font-semibold bg-cyan-500/90 text-slate-950 px-2 py-0.5 rounded-md backdrop-blur-sm">
            TRENDING
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[9px] tracking-wider font-semibold bg-slate-900/95 text-slate-300 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/5">
            {item.type === 'movie' ? 'MOVIE' : 'SERIES'}
          </span>
        )}

        {/* Rating overlay with electric sheen */}
        <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black shadow-md shadow-purple-500/25 border border-purple-400/20 pointer-events-none">
          <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
          <span>{item.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Cinematic Details overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-col justify-end">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] text-cyan-400 font-mono tracking-wider font-bold">
            {item.year}
          </span>
          <span className="text-[10px] text-slate-450">•</span>
          <span className="text-[10px] text-slate-300 font-medium tracking-wide truncate max-w-[120px]">
            {item.genre[0]}
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-display font-medium text-white tracking-wide leading-tight group-hover:text-cyan-400 transition-colors line-clamp-1">
          {item.title}
        </h3>
      </div>

      {/* Glassmorphism Quick Play Play Overlay on Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md bg-slate-950/40">
        <motion.div 
          initial={{ scale: 0.6, rotate: -20 }}
          whileHover={{ scale: 1.08, rotate: 0 }}
          className="cursor-pointer"
        >
          <PremiumPlayIcon 
            size="md" 
            variant={item.isOriginal ? 'purple' : 'cyan'} 
          />
        </motion.div>
        <span className={`absolute bottom-16 text-xs font-mono font-bold tracking-widest uppercase ${
          item.isOriginal ? 'text-purple-400' : 'text-cyan-400'
        }`}>
          Watch Now
        </span>
      </div>
    </motion.div>
  );
}
