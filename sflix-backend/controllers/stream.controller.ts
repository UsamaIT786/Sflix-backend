import { Request, Response, NextFunction } from 'express';

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