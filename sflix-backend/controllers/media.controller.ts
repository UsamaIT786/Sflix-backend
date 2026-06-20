import { Request, Response, NextFunction } from 'express';
import tmdbClient from '../config/tmdb';

// TMDB Genre Mapping (Name -> ID)
const GENRE_MAP: Record<string, number> = {
  "Action": 28,
  "Adventure": 12,
  "Animation": 16,
  "Comedy": 35,
  "Crime": 80,
  "Documentary": 99,
  "Drama": 18,
  "Family": 10751,
  "Fantasy": 14,
  "History": 36,
  "Horror": 27,
  "Music": 10402,
  "Mystery": 9648,
  "Neo-Noir": 18, // Map Neo-Noir to Drama since TMDB doesn't have a specific genre
  "Romance": 10749,
  "Science Fiction": 878,
  "Sci-Fi": 878,
  "TV Movie": 10770,
  "Thriller": 53,
  "War": 10752,
  "Western": 37,
  "Action & Adventure": 10759,
  "Kids": 10762,
  "News": 10763,
  "Reality": 10764,
  "Sci-Fi & Fantasy": 10765,
  "Soap": 10766,
  "Talk": 10767,
  "War & Politics": 10768
};

/**
 * -------------------------------------------------------------------
 * Media Controller
 * -------------------------------------------------------------------
 * Proxies requests to the TMDB API v3 securely — the API key remains
 * server-side only. All responses are wrapped in { success: true, data: ... }
 * -------------------------------------------------------------------
 */

// ─── GET /api/media/trending/:type ────────────────────────────────
export const getTrending = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.params;
    const page = req.query.page || '1';
    const validTypes = ['movie', 'tv', 'all'];
    const mediaType = validTypes.includes(type) ? type : 'all';
    const timeWindow = 'week';

    const response = await tmdbClient.get(
      `/trending/${mediaType}/${timeWindow}`,
      { params: { page } }
    );

    res.set({
      'Cache-Control': 'public, max-age=600, s-maxage=1800',
      'X-Proxy-Source': 'sflix-tmdb',
    });

    res.json({ success: true, data: response.data });
  } catch (error: any) {
    next(error);
  }
};

// ─── GET /api/media/discover/:type ────────────────────────────────
export const getDiscoverMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.params;
    const { year, genre, sort } = req.query;

    const validTypes = ['movie', 'tv'];
    if (!validTypes.includes(type)) {
      res.status(400).json({
        success: false,
        message: `Invalid type "${type}". Must be "movie" or "tv".`,
      });
      return;
    }

    const params: any = { page: 1, language: 'en-US' };

    // Add year filter
    if (year && year !== 'All') {
      if (type === 'movie') {
        params.primary_release_year = year;
      } else {
        params.first_air_date_year = year;
      }
    }

    // Add genre filter
    if (genre && genre !== 'All') {
      let targetGenreId: number | string = genre as string;
      if (isNaN(parseInt(genre as string, 10))) {
        targetGenreId = GENRE_MAP[genre as string] || GENRE_MAP[(genre as string).charAt(0).toUpperCase() + (genre as string).slice(1)];
      }
      if (targetGenreId) {
        params.with_genres = targetGenreId;
      }
    }

    // Add sort
    if (sort === 'top-rated') {
      params.sort_by = 'vote_average.desc';
    } else if (sort === 'newest') {
      params.sort_by = type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc';
    } else {
      params.sort_by = 'popularity.desc';
    }

    // Fetch first page to get total pages
    const firstResponse = await tmdbClient.get(`/discover/${type}`, { params });
    let allResults = [...firstResponse.data.results];
    const totalPages = firstResponse.data.total_pages;
    
    // Fetch remaining pages (limit to 10 pages to avoid hitting TMDB rate limits too hard)
    const maxPages = Math.min(totalPages, 10);
    for (let page = 2; page <= maxPages; page++) {
      const pageParams = { ...params, page };
      const pageResponse = await tmdbClient.get(`/discover/${type}`, { params: pageParams });
      allResults = [...allResults, ...pageResponse.data.results];
    }

    res.set({
      'Cache-Control': 'public, max-age=600, s-maxage=1800',
      'X-Proxy-Source': 'sflix-tmdb',
    });

    res.json({
      success: true,
      data: allResults,
      page: 1,
      total_pages: totalPages,
      total_results: firstResponse.data.total_results
    });
  } catch (error: any) {
    next(error);
  }
};

// ─── GET /api/media/search ──────────────────────────────────────
export const searchMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query.q as string | undefined;
    const page = req.query.page || '1';

    if (!query || query.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required.',
      });
      return;
    }

    const response = await tmdbClient.get('/search/multi', {
      params: { query: query.trim(), page },
    });

    res.set({
      'Cache-Control': 'public, max-age=120, s-maxage=600',
    });

    res.json({ success: true, data: response.data });
  } catch (error: any) {
    next(error);
  }
};

// ─── GET /api/media/genre/:type/:genreId ─────────────────────────
export const getMediaByGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, genreId } = req.params;

    const validTypes = ['movie', 'tv'];
    if (!validTypes.includes(type)) {
      res.status(400).json({
        success: false,
        message: `Invalid type "${type}". Must be "movie" or "tv".`,
      });
      return;
    }

    // If genreId is a name, map to ID
    let targetGenreId: string | number = genreId;
    if (isNaN(parseInt(genreId, 10))) {
      targetGenreId = GENRE_MAP[genreId] || GENRE_MAP[genreId.charAt(0).toUpperCase() + genreId.slice(1)];
      if (!targetGenreId) {
        res.status(400).json({
          success: false,
          message: `Invalid genre "${genreId}".`,
        });
        return;
      }
    }

    const params = {
      with_genres: targetGenreId,
      page: 1,
      language: 'en-US',
      sort_by: 'popularity.desc'
    };
    
    // Fetch first page
    const firstResponse = await tmdbClient.get(`/discover/${type}`, { params });
    let allResults = [...firstResponse.data.results];
    const totalPages = firstResponse.data.total_pages;
    
    // Fetch remaining pages (limit to 10)
    const maxPages = Math.min(totalPages, 10);
    for (let page = 2; page <= maxPages; page++) {
      const pageParams = { ...params, page };
      const pageResponse = await tmdbClient.get(`/discover/${type}`, { params: pageParams });
      allResults = [...allResults, ...pageResponse.data.results];
    }

    res.set({
      'Cache-Control': 'public, max-age=600, s-maxage=1800',
      'X-Proxy-Source': 'sflix-tmdb',
    });

    res.json({
      success: true,
      data: allResults,
      page: 1,
      total_pages: totalPages,
      total_results: firstResponse.data.total_results
    });
  } catch (error: any) {
    next(error);
  }
};

// ─── GET /api/media/detail/:type/:id ──────────────────────────
export const getMediaDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, id } = req.params;

    // Validate "type" — must be "movie" or "tv"
    const validTypes = ['movie', 'tv'];
    if (!validTypes.includes(type)) {
      res.status(400).json({
        success: false,
        message: `Invalid type "${type}". Must be "movie" or "tv".`,
      });
      return;
    }

    // Fetch primary details + credits + videos (trailers) in parallel
    const [detailRes, creditsRes, videosRes] = await Promise.all([
      tmdbClient.get(`/${type}/${id}`),
      tmdbClient.get(`/${type}/${id}/credits`),
      tmdbClient.get(`/${type}/${id}/videos`),
    ]);

    const data = {
      ...detailRes.data,
      credits: creditsRes.data,
      videos: videosRes.data,
    };

    res.set({
      'Cache-Control': 'public, max-age=600, s-maxage=3600',
    });

    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
};