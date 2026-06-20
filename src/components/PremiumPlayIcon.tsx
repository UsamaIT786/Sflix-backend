import React from 'react';

interface PremiumPlayIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'giant';
  variant?: 'gold' | 'cyan' | 'purple';
}

export default function PremiumPlayIcon({ 
  className = '', 
  size = 'md', 
  variant = 'gold' 
}: PremiumPlayIconProps) {
  
  // Size-specific dimensions
  const dims = {
    sm: { container: 'w-10 h-10', inner: 'w-9 h-9', icon: 'w-3.5 h-3.5', translate: 'pl-0.5' },
    md: { container: 'w-14 h-14', inner: 'w-12 h-12', icon: 'w-5.5 h-5.5', translate: 'pl-1' },
    lg: { container: 'w-18 h-18', inner: 'w-16 h-16', icon: 'w-7.5 h-7.5', translate: 'pl-1.5' },
    giant: { container: 'w-24 h-24', inner: 'w-20  h-20', icon: 'w-10 h-10', translate: 'pl-2' }
  }[size];

  // Theme colors
  const themes = {
    gold: {
      outerRing: 'border-amber-400/40 bg-amber-400/5 shadow-amber-500/30',
      glowRing: 'bg-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
      glassBg: 'bg-gradient-to-b from-slate-900/90 to-neutral-950/95 border-amber-400/40',
      iconFill: 'url(#goldPremiumGrad)',
      filterId: 'goldGlowFilter'
    },
    cyan: {
      outerRing: 'border-cyan-400/40 bg-cyan-400/5 shadow-cyan-500/30',
      glowRing: 'bg-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.5)]',
      glassBg: 'bg-gradient-to-b from-slate-900/90 to-neutral-950/95 border-cyan-400/40',
      iconFill: 'url(#cyanPremiumGrad)',
      filterId: 'cyanGlowFilter'
    },
    purple: {
      outerRing: 'border-purple-400/40 bg-purple-400/5 shadow-purple-500/30',
      glowRing: 'bg-purple-400/20 shadow-[0_0_15px_rgba(168,85,247,0.5)]',
      glassBg: 'bg-gradient-to-b from-slate-900/90 to-neutral-950/95 border-purple-400/40',
      iconFill: 'url(#purplePremiumGrad)',
      filterId: 'purpleGlowFilter'
    }
  }[variant];

  return (
    <div className={`relative flex items-center justify-center ${dims.container} ${className}`} id={`premium-play-wrapper-${size}`}>
      {/* 1. PULSING OUTER REVERB Aura */}
      <div className={`absolute inset-0 rounded-full border opacity-75 animate-pulse transition-all duration-1000 ${themes.outerRing}`} />

      {/* 2. DESSERT GLOW HALO */}
      <div className={`absolute inset-1 rounded-full opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out pointer-events-none blur-sm ${themes.glowRing}`} />

      {/* 3. POLISHED COUNTER METALLIC GLASS RING */}
      <div className={`absolute inset-0.5 rounded-full border flex items-center justify-center backdrop-blur-md shadow-inner transition-transform duration-500 group-hover:scale-105 ${themes.glassBg}`}>
        
        {/* Play core SVG vector symbol */}
        <div className={`relative ${dims.inner} flex items-center justify-center ${dims.translate}`}>
          <svg 
            viewBox="0 0 100 100" 
            className={`${dims.icon} drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] filter transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gold gradient with high specular mapping */}
              <linearGradient id="goldPremiumGrad" x1="10%" y1="10%" x2="90%" y2="90%">
                <stop offset="0%" stopColor="#fef08a" /> {/* Yellow 200 */}
                <stop offset="40%" stopColor="#f59e0b" /> {/* Amber 500 */}
                <stop offset="100%" stopColor="#b45309" /> {/* Amber 700 */}
              </linearGradient>

              {/* Cyan gradient */}
              <linearGradient id="cyanPremiumGrad" x1="10%" y1="10%" x2="90%" y2="90%">
                <stop offset="0%" stopColor="#e0f7fa" />
                <stop offset="50%" stopColor="#06b2d2" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>

              {/* Purple gradient */}
              <linearGradient id="purplePremiumGrad" x1="10%" y1="10%" x2="90%" y2="90%">
                <stop offset="0%" stopColor="#f3e8ff" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>

              {/* Custom SVG filter shadow mask */}
              <filter id="softShadowFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* A magnificent precision rounded triangle */}
            <path 
              d="M32 18 C32 12.5 38 9 43 12 L85 38 C90 41 90 49 85 52 L43 78 C38 81 32 77.5 32 72 Z" 
              fill={themes.iconFill}
              filter="url(#softShadowFilter)"
            />
          </svg>
        </div>

      </div>

      {/* 4. LITTLE FLOATING ORBITAL GLIMMER DECORATION */}
      <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-[0_0_8px_#ffffff] animate-bounce" />
    </div>
  );
}
