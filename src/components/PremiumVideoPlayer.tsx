import React, { useState, useEffect, useRef } from 'react';

interface PremiumVideoPlayerProps {
  tmdbId: string;
  mediaType: 'movie' | 'tv';
  seasonNumber?: number;
  episodeNumber?: number;
}

interface Server {
  id: string;
  name: string;
  getEmbedUrl: (tmdbId: string, season?: number, episode?: number) => string;
}

const servers: Server[] = [
  {
    id: 'vidsrc',
    name: 'VidSrc',
    getEmbedUrl: (tmdbId: string, season?: number, episode?: number) => {
      if (season !== undefined && episode !== undefined) {
        return `https://vidsrc.me/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc.me/embed/movie/${tmdbId}`;
    },
  },
  {
    id: 'vidsrc-pro',
    name: 'VidSrc Pro',
    getEmbedUrl: (tmdbId: string, season?: number, episode?: number) => {
      if (season !== undefined && episode !== undefined) {
        return `https://vidsrc.pro/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc.pro/embed/movie/${tmdbId}`;
    },
  },
  {
    id: '2embed',
    name: '2Embed',
    getEmbedUrl: (tmdbId: string, season?: number, episode?: number) => {
      if (season !== undefined && episode !== undefined) {
        return `https://www.2embed.cc/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://www.2embed.cc/embed/tmdb/${tmdbId}`;
    },
  },
];

const PremiumVideoPlayer: React.FC<PremiumVideoPlayerProps> = ({
  tmdbId,
  mediaType,
  seasonNumber: initialSeason = 1,
  episodeNumber: initialEpisode = 1,
}) => {
  const [activeServer, setActiveServer] = useState<string>(servers[0].id);
  const [currentSeason, setCurrentSeason] = useState<number>(initialSeason);
  const [currentEpisode, setCurrentEpisode] = useState<number>(initialEpisode);
  const [isLoadingServer, setIsLoadingServer] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeServerConfig = servers.find((s) => s.id === activeServer)!;
  const embedUrl = activeServerConfig.getEmbedUrl(
    tmdbId,
    mediaType === 'tv' ? currentSeason : undefined,
    mediaType === 'tv' ? currentEpisode : undefined
  );

  // ─── STRONG POPUP + AD BLOCKER ───────────────────────────────────────────
  useEffect(() => {
    const originalOpen = window.open;
    window.open = (): null => {
      console.warn('[AdBlock] window.open blocked');
      return null;
    };

    const blockNavigation = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (
        anchor &&
        ['_blank', '_top', '_parent', '_self'].some(
          (t) => anchor.target === t && anchor.href && !anchor.href.startsWith(window.location.origin)
        )
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        console.warn('[AdBlock] External navigation blocked:', anchor.href);
      }
    };

    const originalAssign = window.location.assign.bind(window.location);
    const originalReplace = window.location.replace.bind(window.location);

    try {
      Object.defineProperty(window.location, 'assign', {
        configurable: true,
        value: (url: string) => {
          if (url && !url.startsWith(window.location.origin)) {
            console.warn('[AdBlock] location.assign blocked:', url);
            return;
          }
          originalAssign(url);
        },
      });
      Object.defineProperty(window.location, 'replace', {
        configurable: true,
        value: (url: string) => {
          if (url && !url.startsWith(window.location.origin)) {
            console.warn('[AdBlock] location.replace blocked:', url);
            return;
          }
          originalReplace(url);
        },
      });
    } catch (_) {}

    const originalPushState = history.pushState.bind(history);
    history.pushState = function (...args: Parameters<typeof history.pushState>) {
      const url = args[2];
      if (url && typeof url === 'string' && url.startsWith('http') && !url.startsWith(window.location.origin)) {
        console.warn('[AdBlock] history.pushState blocked:', url);
        return;
      }
      return originalPushState(...args);
    };

    const blockUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };

    document.addEventListener('click', blockNavigation, true);
    window.addEventListener('beforeunload', blockUnload, true);

    return () => {
      window.open = originalOpen;
      history.pushState = originalPushState;
      document.removeEventListener('click', blockNavigation, true);
      window.removeEventListener('beforeunload', blockUnload, true);
      try {
        Object.defineProperty(window.location, 'assign', { configurable: true, value: originalAssign });
        Object.defineProperty(window.location, 'replace', { configurable: true, value: originalReplace });
      } catch (_) {}
    };
  }, []);

  // ─── IFRAME ATTRIBUTE INJECTION ──────────────────────────────────────────
  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('webkitallowfullscreen', '');
      iframe.setAttribute('mozallowfullscreen', '');
      iframe.setAttribute('msallowfullscreen', '');
      iframe.setAttribute('x-webkit-airplay', 'allow');
      iframe.setAttribute('airplay', 'allow');
      iframe.setAttribute(
        'allow',
        'autoplay; encrypted-media; picture-in-picture; fullscreen; remote-playback; presentation'
      );
    }
  }, [activeServer, currentSeason, currentEpisode]);

  // ─── LOADING WATCHER ─────────────────────────────────────────────────────
  useEffect(() => {
    setIsLoadingServer(true);
    const watchDog = setTimeout(() => {
      setIsLoadingServer(false);
    }, 3000);
    return () => clearTimeout(watchDog);
  }, [activeServer, currentSeason, currentEpisode]);

  const handleIframeLoad = () => {
    setIsLoadingServer(false);
  };

  return (
    <div className="w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/90 shadow-2xl backdrop-blur-xl border border-white/10">
        {isLoadingServer && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-cyan-400 animate-spin mb-4" />
            <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase animate-pulse">
              Loading {activeServerConfig.name}...
            </p>
          </div>
        )}

        <iframe
          ref={iframeRef}
          key={`${activeServer}-${currentSeason}-${currentEpisode}`}
          src={embedUrl}
          className={`w-full h-full transition-opacity duration-500 ${
            isLoadingServer ? 'opacity-0' : 'opacity-100'
          }`}
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen; remote-playback; presentation"
          referrerPolicy="no-referrer"
          title={`${activeServerConfig.name} - Media Player`}
          loading="lazy"
          onLoad={handleIframeLoad}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => setActiveServer(server.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeServer === server.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {server.name}
          </button>
        ))}
      </div>

      {mediaType === 'tv' && (
        <div className="mt-4 bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Episodes</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {[1,2,3,4,5,6,7,8,9,10].map((season) => (
              <button
                key={season}
                onClick={() => { setCurrentSeason(season); setCurrentEpisode(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentSeason === season ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Season {season}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((episode) => (
              <button
                key={episode}
                onClick={() => setCurrentEpisode(episode)}
                className={`aspect-square rounded-lg text-sm font-semibold flex items-center justify-center transition-all ${
                  currentEpisode === episode
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {episode}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumVideoPlayer;