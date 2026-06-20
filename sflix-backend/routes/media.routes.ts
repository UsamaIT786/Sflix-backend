import { Router } from 'express';
import {
  getTrending,
  searchMedia,
  getMediaDetail,
  getMediaByGenre,
  getDiscoverMedia,
} from '../controllers/media.controller';

const router = Router();

// GET /api/media/trending/:type
router.get('/trending/:type', getTrending);

// GET /api/media/discover/:type
router.get('/discover/:type', getDiscoverMedia);

// GET /api/media/search
router.get('/search', searchMedia);

// GET /api/media/detail/:type/:id
router.get('/detail/:type/:id', getMediaDetail);

// GET /api/media/genre/:type/:genreId?page=...
router.get('/genre/:type/:genreId', getMediaByGenre);

export default router;