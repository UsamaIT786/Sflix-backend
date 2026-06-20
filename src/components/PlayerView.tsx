import React, { useState } from 'react';
import { MediaItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Star, ListVideo, Tv } from 'lucide-react';
import PremiumVideoPlayer from './PremiumVideoPlayer';

interface PlayerViewProps {
  item: MediaItem;
  onBackToDiscovery: () => void;
  onSelectMedia: (id: string) => void;
  allMedia: MediaItem[];
}

export default function PlayerView({
  item,
  onBackToDiscovery,
  onSelectMedia,
  allMedia,
}: PlayerViewProps) {
  const [activeSeasonNum, setActiveSeasonNum] = useState(1);
  const [activeEpisodeNum, setActiveEpisodeNum] = useState(1);

  // Filter recommendations
  const recommendations = allMedia
    .filter(
      m =>
        m.id !== item.id &&
        (m.genre.some(g => item.genre.includes(g)) || m.type === item.type)
    )
    .slice(0, 4);

  return (
    <div className="w-full pb-24 relative" id="player-detailed-page">
      {/* 1. CINEMATIC GRADIENT BACKGROUND WRAPPER */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] z-0 overflow-hidden">
        <img
          src={item.backdropUrl}
          alt={item.title}
          className="w-full h-full object-cover object-center filter blur-xl brightness-30 opacity-40 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      </div>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 relative z-10 space-y-8"
        id="player-viewport-sections"
      >
        {/* Back Link Row */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDiscovery}
            className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-widest cursor-pointer"
            id="back-to-discovery-btn"
          >
            &larr; Back to Catalog / Hub
          </button>
        </div>

        {/* 2. VIEWPORT — INTEGRATED PREMIUMVIDEOPLAYER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main video player column (left) */}
          <div className="lg:col-span-8 space-y-6">
            <PremiumVideoPlayer
                tmdbId={String(item.tmdbId)}
                mediaType={item.type === 'show' ? 'tv' : item.type}
                seasonNumber={activeSeasonNum}
                episodeNumber={activeEpisodeNum}
              />
          </div>

          {/* Movie credentials sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div
              className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4"
              id="movie-credentials-sidebar"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <ListVideo className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-display font-medium text-white uppercase tracking-wider">
                  Stream Credentials
                </h3>
              </div>
              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-500 font-mono">Stream Quality</span>
                  <span className="text-emerald-400 font-bold font-mono">2160p 4K UHD</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-500 font-mono">Audio Track</span>
                  <span className="text-slate-300 font-medium">Atmos Dual 5.1</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-500 font-mono">Subs CC</span>
                  <span className="text-slate-300">English, Spanish, French</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-500 font-mono">Encryption TLS</span>
                  <span className="text-purple-400 font-bold font-mono">SHA-256 SECURED</span>
                </div>
              </div>
            </div>

            {/* Premium feature highlight panel */}
            <div className="glass-panel rounded-2xl p-5 border border-purple-400/20 bg-gradient-to-tr from-purple-400/5 to-slate-900/40 relative overflow-hidden space-y-3">
              <span className="absolute top-0 right-0 h-10 w-10 bg-purple-400/10 rounded-bl-full flex items-center justify-center p-1 font-mono text-xs text-cyan-400 font-bold">
                VIP
              </span>
              <h4 className="text-xs font-display font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1">
                VIP High-Speed Buffer Shield
              </h4>
              <p className="text-[11px] text-slate-400 font-sans leading-normal">
                Upgrade to our VIP Access to instantly unlock dedicated 10Gbps Edge streams,
                eliminating buffer timeouts forever.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 font-bold cursor-pointer">
                <span>UNLOCK EXCLUSIVE VIP CDN NOW</span>
                <span>&rarr;</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. METADATA INFOPANEL AND RECENT RECOMMENDATIONS */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10" id="player-detailed-metadata">
          {/* Detailed text descriptions (left column) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                {item.genre.map(g => (
                  <span
                    key={g}
                    className="bg-slate-900 border border-white/10 text-white text-[10.5px] font-mono px-2.5 py-0.5 rounded-full uppercase"
                  >
                    {g}
                  </span>
                ))}
                <span className="bg-purple-500/15 border border-purple-500/30 text-cyan-400 text-[10.5px] font-bold font-mono px-2.5 py-0.5 rounded uppercase">
                  ⭐ TMDB {item.rating}
                </span>
                <span className="text-slate-500 text-xs font-mono font-medium ml-2">
                  {item.year}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
                {item.title}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans pb-4 border-b border-white/5">
              {item.description}
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500 font-mono flex-wrap">
              <span>
                Node location: <span className="text-slate-300">GlowCDN Cluster</span>
              </span>
              <span>
                Bitrate: <span className="text-slate-300">14.8 Mbps peak</span>
              </span>
              <span>
                Codec: <span className="text-slate-300">h.265 Advanced</span>
              </span>
            </div>
          </div>

          {/* Related recommendation cards (right column) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest pb-2 border-b border-white/5">
              Similar Nodes Recommended
            </h3>
            <div className="space-y-4">
              {recommendations.map(rec => (
                <div
                  key={rec.id}
                  onClick={() => onSelectMedia(rec.id)}
                  className="flex gap-4 p-2 bg-slate-900/20 hover:bg-slate-900/50 border border-white/5 hover:border-white/10 rounded-xl cursor-pointer group transition-colors"
                >
                  <img
                    src={rec.posterUrl}
                    alt={rec.title}
                    className="w-14 h-20 rounded-lg object-cover object-center flex-shrink-0 border border-white/5 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 mb-1 font-bold">
                      <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                      {rec.rating}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 truncate transition-colors">
                      {rec.title}
                    </h4>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                      {rec.year} &bull; {rec.genre[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}