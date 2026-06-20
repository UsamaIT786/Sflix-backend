import { Router, Request, Response } from 'express';
import {
  getMovieStreams,
  getTvStreams,
} from '../controllers/stream.controller';

const router = Router();

// GET /api/streams (generic - returns info about available stream endpoints)
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Stream endpoints available at /api/streams/movie/:tmdbId and /api/streams/tv/:tmdbId/:season/:episode',
    sources: [],
  });
});

// GET /api/streams/movie/:tmdbId
router.get('/movie/:tmdbId', getMovieStreams);

// GET /api/streams/tv/:tmdbId/:season/:episode
router.get('/tv/:tmdbId/:season/:episode', getTvStreams);

export default router;
