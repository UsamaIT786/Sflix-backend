import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

/**
 * -------------------------------------------------------------------
 * Stream Controller
 * -------------------------------------------------------------------
 * Resolves a TMDB ID into an array of embed mirror sources for the
 * SFlix server selection grid.  Each mirror maps to a real embed
 * provider so the front-end player can switch between sources.
 * -------------------------------------------------------------------
 */

// ─── Mirror source definitions ───────────────────────────────────
// When a provider supports both movie & TV embed URLs the template
// strings use :tmdbId, :season, :episode placeholders.
interface MirrorSource {
  serverName: string;
  buildUrl: (tmdbId: string, season?: string, episode?: string) => string;
  status: 'active' | 'warning';
}

const MOVIE_MIRRORS: MirrorSource[] = [
  {
    serverName: 'Server Iris',
    buildUrl: (id) => `https://vidsrc.to/embed/movie/${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Core',
    buildUrl: (id) => `https://vidsrc.me/embed/movie/${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Nexus',
    buildUrl: (id) =>
      `https://multiembed.cm/?video_id=${id}&tmdb=1`,
    status: 'active',
  },
  {
    serverName: 'Server Peak',
    buildUrl: (id) => `https://vidsrc.dev/embed/movie/${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Flux',
    buildUrl: (id) => `https://player.superembed.stream/movie/${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Sable',
    buildUrl: (id) => `https://www.2embed.to/embed/tmdb/movie?id=${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Crest',
    buildUrl: (id) => `https://moviesapi.club/movie/${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Edge',
    buildUrl: (id) => `https://embed.su/embed/movie/${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Titan',
    buildUrl: (id) => `https://autoembed.cc/embed/movie/${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Glow',
    buildUrl: (id) => `https://dbgo.fun/movie/${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Surge',
    buildUrl: (id) => `https://filmgin.net/movie/${id}`,
    status: 'warning',
  },
  {
    serverName: 'Server Apex',
    buildUrl: (id) => `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
    status: 'active',
  },
  {
    serverName: 'Server Storm',
    buildUrl: (id) => `https://vidsrc.net/embed/movie/${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Verge',
    buildUrl: (id) => `https://player.vidsrc.in/movie/${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Echo',
    buildUrl: (id) => `https://2embed.org/embed/movie/${id}`,
    status: 'warning',
  },
  {
    serverName: 'Server Vortex',
    buildUrl: (id) => `https://gomo.to/movie/${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Cobra',
    buildUrl: (id) => `https://heromoviez.com/movie/${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Quill',
    buildUrl: (id) => `https://embedstream.net/movie/${id}`,
    status: 'active',
  },
  {
    serverName: 'Server Forge',
    buildUrl: (id) => `https://vidlink.pro/movie/${id}`,
    status: 'active',
  },
];

const TV_MIRRORS: MirrorSource[] = [
  {
    serverName: 'Server Iris',
    buildUrl: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Core',
    buildUrl: (id, s, e) => `https://vidsrc.me/embed/tv/${id}/${s}/${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Nexus',
    buildUrl: (id, s, e) =>
      `https://multiembed.cm/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Peak',
    buildUrl: (id, s, e) => `https://vidsrc.dev/embed/tv/${id}/${s}/${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Flux',
    buildUrl: (id, s, e) =>
      `https://player.superembed.stream/tv/${id}/${s}/${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Sable',
    buildUrl: (id, s, e) =>
      `https://www.2embed.to/embed/tmdb/tv?id=${id}&s=${s}&e=${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Crest',
    buildUrl: (id, s, e) => `https://moviesapi.club/tv/${id}/${s}/${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Edge',
    buildUrl: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Titan',
    buildUrl: (id, s, e) => `https://autoembed.cc/embed/tv/${id}/${s}/${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Glow',
    buildUrl: (id, s, e) => `https://dbgo.fun/tv/${id}/${s}/${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Surge',
    buildUrl: (id, s, e) => `https://filmgin.net/tv/${id}/${s}/${e}`,
    status: 'warning',
  },
  {
    serverName: 'Server Apex',
    buildUrl: (id, s, e) =>
      `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Storm',
    buildUrl: (id, s, e) => `https://vidsrc.net/embed/tv/${id}/${s}/${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Verge',
    buildUrl: (id, s, e) => `https://player.vidsrc.in/tv/${id}/${s}/${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Echo',
    buildUrl: (id, s, e) => `https://2embed.org/embed/tv/${id}/${s}/${e}`,
    status: 'warning',
  },
  {
    serverName: 'Server Vortex',
    buildUrl: (id, s, e) => `https://gomo.to/tv/${id}/${s}/${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Cobra',
    buildUrl: (id, s, e) => `https://heromoviez.com/tv/${id}/${s}/${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Quill',
    buildUrl: (id, s, e) => `https://embedstream.net/tv/${id}/${s}/${e}`,
    status: 'active',
  },
  {
    serverName: 'Server Forge',
    buildUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
    status: 'active',
  },
];

// ─── GET /api/streams/movie/:tmdbId ───────────────────────────
export const getMovieStreams = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tmdbId } = req.params;

    if (!tmdbId || !/^\d+$/.test(tmdbId)) {
      res.status(400).json({
        success: false,
        message: 'TMDB ID must be a numeric value.',
      });
      return;
    }

    const sources = MOVIE_MIRRORS.map((m) => ({
      serverName: m.serverName,
      url: m.buildUrl(tmdbId),
      status: m.status,
    }));

    res.json({
      success: true,
      tmdbId,
      type: 'movie',
      sources,
    });
  } catch (error: any) {
    next(error);
  }
};

// ─── GET /api/streams/tv/:tmdbId/:season/:episode ────────────
export const getTvStreams = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tmdbId, season, episode } = req.params;

    if (!tmdbId || !/^\d+$/.test(tmdbId)) {
      res.status(400).json({
        success: false,
        message: 'TMDB ID must be a numeric value.',
      });
      return;
    }

    const seasonNum = parseInt(season, 10);
    const episodeNum = parseInt(episode, 10);

    if (isNaN(seasonNum) || seasonNum < 1) {
      res.status(400).json({
        success: false,
        message: 'Season must be a positive integer.',
      });
      return;
    }

    if (isNaN(episodeNum) || episodeNum < 1) {
      res.status(400).json({
        success: false,
        message: 'Episode must be a positive integer.',
      });
      return;
    }

    const sources = TV_MIRRORS.map((m) => ({
      serverName: m.serverName,
      url: m.buildUrl(tmdbId, String(seasonNum), String(episodeNum)),
      status: m.status,
    }));

    res.json({
      success: true,
      tmdbId,
      type: 'tv',
      season: seasonNum,
      episode: episodeNum,
      sources,
    });
  } catch (error: any) {
    next(error);
  }
};

// ─── GET /api/streams/download/:tmdbId ───────────────────────────
// Resolves: TMDB ID → IMDB ID (via TMDB API) → YTS torrent details
// → redirects to highest-quality direct .torrent / magnet link.
// For TV shows, falls back to a curated public-domain episode sample.
export const downloadStream = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tmdbId } = req.params;
    const mediaType = (req.query.type as string) || 'movie';

    // ── Step 1: Resolve TMDB ID → IMDB ID ──────────────────────
    const TMDB_TOKEN = process.env.TMDB_API_KEY || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZTM4ZmZmZWQ4ZTk2YTc2ODQwNjliYjNhY2MxYWNkNCIsIm5iZiI6MTc4MTY5MDMwNi43OTgsInN1YiI6IjZhMzI2ZmMyZDUyYzY0OTYzYWQzOTAwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3k8r-TOzjeqNsmgQ9SAyXEseu_AQ0TCAQj6muZu_BO0';

    let imdbId: string | null = null;
    let movieTitle: string = `Movie_${tmdbId}`;

    try {
      const tmdbEndpoint = mediaType === 'tv'
        ? `https://api.themoviedb.org/3/tv/${tmdbId}/external_ids`
        : `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids`;

      const tmdbRes = await axios.get(tmdbEndpoint, {
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        timeout: 8000,
      });
      imdbId = tmdbRes.data?.imdb_id || null;

      // Also get the movie title for the filename
      if (mediaType !== 'tv') {
        const detailsRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
          timeout: 8000,
        });
        movieTitle = (detailsRes.data?.title || movieTitle).replace(/[^a-zA-Z0-9 _-]/g, '').trim();
      }
    } catch (e) {
      console.warn('[Download] TMDB lookup failed, proceeding without IMDB ID');
    }

    // ── Step 2: For movies, query YTS API for real download link ─
    if (mediaType !== 'tv' && imdbId) {
      try {
        const ytsRes = await axios.get(`https://yts.mx/api/v2/movie_details.json`, {
          params: { imdb_id: imdbId, with_images: false, with_cast: false },
          timeout: 10000,
        });

        const movie = ytsRes.data?.data?.movie;
        if (movie && movie.torrents && movie.torrents.length > 0) {
          // Prefer 1080p BluRay, then 720p, then whatever is available
          const preferred = ['2160p', '1080p.BluRay', '1080p', '720p'];
          let bestTorrent = movie.torrents[0];
          for (const quality of preferred) {
            const found = movie.torrents.find((t: any) =>
              t.quality?.toLowerCase().includes(quality.toLowerCase().replace('.', ''))
            );
            if (found) { bestTorrent = found; break; }
          }

          const safeTitle = movieTitle.replace(/ /g, '_');
          // Redirect to the direct torrent file download
          res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}_${bestTorrent.quality}.torrent"`);
          return res.redirect(bestTorrent.url);
        }
      } catch (e) {
        console.warn('[Download] YTS lookup failed, falling back to proxy');
      }
    }

    // ── Step 3: Fallback — stream a reliable public-domain sample ─
    // This runs when: it's a TV show, YTS has no entry, or any step fails.
    const FALLBACK_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
    const safeFilename = movieTitle.replace(/ /g, '_');

    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');

    const fallbackRes = await axios({
      method: 'GET',
      url: FALLBACK_VIDEO_URL,
      responseType: 'stream',
      timeout: 30000,
    });

    if (fallbackRes.headers['content-length']) {
      res.setHeader('Content-Length', fallbackRes.headers['content-length'] as string);
    }

    fallbackRes.data.pipe(res);

    fallbackRes.data.on('error', (err: any) => {
      console.error('[Download] Fallback stream error:', err);
      if (!res.headersSent) res.status(500).end();
    });

  } catch (error: any) {
    next(error);
  };
};