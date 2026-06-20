import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Volume2, Settings, Maximize, AlertTriangle, Zap } from 'lucide-react';

export interface VideoServer {
  serverName: string;
  url: string;
  status: 'active' | 'warning' | 'dead';
}

interface VideoPlayerSectionProps {
  servers?: VideoServer[];
  backendUrl?: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export default function VideoPlayerSection({ servers: serversProp, backendUrl }: VideoPlayerSectionProps) {
  const [sources, setSources] = useState<VideoServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeServerUrl, setActiveServerUrl] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkIsDirectVideo = useCallback((urlStr: string): boolean => {
    if (!urlStr) return false;
    const l = urlStr.toLowerCase();
    return l.includes('.mp4') || l.includes('.m3u8') || l.includes('.mpd') || l.includes('.webm') || l.includes('.mov') || l.includes('.ogg');
  }, []);

  // Block window.open and blur refocus
  useEffect(() => {
    const orig = window.open;
    window.open = (): null => null;
    const refocus = () => setTimeout(() => window.focus(), 50);
    window.addEventListener('blur', refocus);
    return () => {
      window.open = orig;
      window.removeEventListener('blur', refocus);
    };
  }, []);

  const runLoadingSequence = useCallback((finalUrl: string) => {
    if (!finalUrl) { setError('Invalid URL'); setIsLoading(false); return; }
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    setActiveServerUrl('');
    setIsLoading(true);
    setError(null);
    setBufferProgress(0);

    const start = Date.now();
    const duration = 2800;

    progressIntervalRef.current = setInterval(() => {
      const pct = Math.min(Math.round(((Date.now() - start) / duration) * 100), 100);
      setBufferProgress(pct);
      if (pct >= 100 && progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; }
    }, 40);

    loadTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setActiveServerUrl(finalUrl.trim());
      setTimeout(() => {
        if (videoRef.current && checkIsDirectVideo(finalUrl)) {
          try { videoRef.current.load(); videoRef.current.play().catch(() => {}); } catch (_) {}
        }
      }, 50);
      if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; }
    }, 3000);
  }, [checkIsDirectVideo]);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      if (serversProp?.length) {
        if (cancelled) return;
        setSources(serversProp);
        const active = serversProp.find(s => s.status === 'active') ?? serversProp[0];
        active?.url ? runLoadingSequence(active.url) : (setError('No valid server'), setIsLoading(false));
        return;
      }
      if (!backendUrl) { if (!cancelled) { setError('No servers provided.'); setIsLoading(false); } return; }
      try {
        const res = await fetch(`${backendUrl}/api/streams`);
        if (!res.ok) throw new Error(`Backend returned ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        const fetched: VideoServer[] = data.sources || data.mirrors || [];
        if (!fetched.length) { setError('No stream sources available.'); setIsLoading(false); return; }
        setSources(fetched);
        const active = fetched.find(s => s.status === 'active') ?? fetched[0];
        active?.url ? runLoadingSequence(active.url) : (setError('No valid server'), setIsLoading(false));
      } catch (err: unknown) {
        if (!cancelled) { setError(err instanceof Error ? err.message : 'Failed to fetch.'); setIsLoading(false); }
      }
    };
    init();
    return () => {
      cancelled = true;
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [serversProp, backendUrl, runLoadingSequence]);

  const handleServerSelect = useCallback((server: VideoServer) => {
    if (!server || server.status === 'dead' || server.url === activeServerUrl) return;
    runLoadingSequence(server.url);
  }, [activeServerUrl, runLoadingSequence]);

  const activeServer = sources.find(s => s.url === activeServerUrl);
  const useVideoTag = checkIsDirectVideo(activeServerUrl);
  const iframeSrc = activeServerUrl
    ? activeServerUrl.includes('?') ? `${activeServerUrl}&autoplay=1&muted=1` : `${activeServerUrl}?autoplay=1&muted=1`
    : '';

  useEffect(() => {
    if (iframeRef.current && activeServerUrl && !useVideoTag) {
      const f = iframeRef.current;
      f.setAttribute('allowfullscreen', '');
      f.setAttribute('webkitallowfullscreen', '');
      f.setAttribute('mozallowfullscreen', '');
      f.setAttribute('x-webkit-airplay', 'allow');
      f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen; remote-playback; presentation');
    }
  }, [activeServerUrl, useVideoTag]);

  return (
    <div className="w-full space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#0d0e15] border border-white/[0.06] shadow-2xl"
        style={{ boxShadow: '0 0 60px rgba(0,243,255,0.08), 0 0 120px rgba(168,85,247,0.04)' }}
      >
        {/* Loading */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d0e15]">
            <div className="space-y-4 max-w-xs text-center">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20" />
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold tracking-wider text-white uppercase">CONNECTING PREMIUM MIRROR</h4>
              <div className="w-full max-w-[200px] mx-auto h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-100 ease-out rounded-full" style={{ width: `${bufferProgress}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider">Syncing buffer: {bufferProgress}%</p>
            </div>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#0d0e15] p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-400" />
            <span className="text-sm font-mono text-slate-400 max-w-md">{error}</span>
          </div>
        )}

        {/* Player */}
        {!isLoading && !error && activeServerUrl && (
          <>
            {useVideoTag ? (
              <video
                key={activeServerUrl} ref={videoRef} src={activeServerUrl}
                className="absolute inset-0 w-full h-full object-contain bg-black"
                controls autoPlay muted playsInline crossOrigin="anonymous"
              />
            ) : (
              <iframe
                ref={iframeRef} key={iframeSrc} src={iframeSrc}
                width="100%" height="100%" allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen; remote-playback; presentation"
                referrerPolicy="no-referrer"
                title={`Stream - ${activeServer?.serverName ?? 'Player'}`}
                className="absolute inset-0 z-0 w-full h-full border-none"
                loading="lazy"
              />
            )}
          </>
        )}

        {/* Empty */}
        {!isLoading && !error && !activeServerUrl && sources.length === 0 && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#0d0e15] p-6 text-center">
            <AlertTriangle className="w-10 h-10 text-slate-600" />
            <span className="text-sm font-mono text-slate-500">No streams available.</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
          <span className="text-[10px] font-mono font-semibold text-white/70 uppercase tracking-[0.15em]">
            {activeServer?.serverName ?? 'SFlix'} <span className="text-cyan-400">Secure Stream</span>
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <span className="text-[10px] font-mono font-bold text-white/50 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5 uppercase tracking-wider">1080p</span>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4 bg-gradient-to-t from-[#0d0e15]/95 via-[#0d0e15]/70 to-transparent pointer-events-none">
          <div className="w-full h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
            <div className="h-full w-[37%] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(0,243,255,0.7)]" />
            </div>
          </div>
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-white hover:text-cyan-400 transition-colors">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              </motion.button>
              <button className="text-white/50 hover:text-white transition-colors"><Volume2 className="w-4 h-4" /></button>
              <span className="text-[11px] sm:text-xs font-mono text-white/50 tracking-wide tabular-nums whitespace-nowrap select-none">
                <span className="text-white font-medium">0:00:00</span><span className="mx-1">/</span><span>1:46:48</span>
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button whileHover={{ rotate: 60 }} transition={{ duration: 0.3 }} className="text-white/50 hover:text-cyan-400 transition-colors">
                <Settings className="w-4 h-4" />
              </motion.button>
              <button className="text-white/50 hover:text-white transition-colors"><Maximize className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Warning banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="relative flex items-center gap-3 px-4 sm:px-5 py-3 rounded-xl border border-amber-500/30 bg-[#0d0e15]/70 backdrop-blur-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <span className="text-[12px] sm:text-sm font-medium text-amber-300/90 tracking-wide">
          ⚠️ Video won't play? Pick another server below.
        </span>
      </motion.div>

      {/* Server grid */}
      {sources.length === 0 && !error ? (
        <div className="flex items-center justify-center py-8">
          <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="ml-3 text-xs font-mono text-slate-500">Loading server mirrors...</span>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {sources.map((server) => {
            const isActive = server.url.trim() === activeServerUrl;
            const isDead = server.status === 'dead';
            return (
              <motion.button key={server.url} variants={cardVariants}
                whileHover={!isActive && !isDead ? { y: -3, scale: 1.02 } : undefined}
                whileTap={!isActive && !isDead ? { scale: 0.97 } : undefined}
                onClick={() => handleServerSelect(server)} disabled={isDead}
                className={`relative flex items-center gap-2.5 px-3 py-2.5 sm:py-3 rounded-xl transition-all duration-300 text-left cursor-pointer ${
                  isDead ? 'opacity-40 cursor-not-allowed bg-[#0d0e15]/40 border border-rose-500/20'
                  : isActive ? 'bg-gradient-to-r from-cyan-500/25 to-teal-500/20 border border-cyan-400/50 shadow-[0_0_20px_rgba(0,243,255,0.15)]'
                  : 'bg-[#0d0e15]/60 backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.03]'}`}>
                {isActive && (
                  <motion.span initial={{ opacity: 0, y: -8, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute -top-[9px] -right-[9px] z-10 text-[8px] font-mono font-bold uppercase tracking-[0.1em] px-2 py-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 text-[#0d0e15]">
                    On air
                  </motion.span>
                )}
                {isDead && (
                  <span className="absolute -top-[9px] -right-[9px] z-10 text-[8px] font-mono font-bold uppercase px-2 py-[2px] rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400">Dead</span>
                )}
                <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'bg-white' : isDead ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-white/5 border border-white/[0.06]'}`}>
                  <Play className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? 'text-[#0d0e15] fill-[#0d0e15]' : isDead ? 'text-rose-400/50 fill-rose-400/50' : 'text-white/30 fill-white/30'}`} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`text-[11px] sm:text-xs font-semibold leading-tight truncate ${isActive ? 'text-white' : isDead ? 'text-rose-400/60' : 'text-white/70'}`}>
                    {server.serverName}
                  </span>
                  {isActive && <span className="text-[9px] font-mono text-cyan-300/80 mt-0.5">Live</span>}
                  {isDead && <span className="text-[9px] font-mono text-rose-400/60 mt-0.5">Offline</span>}
                </div>
                {isActive && <span className="absolute bottom-1.5 right-2.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}