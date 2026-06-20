import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Pre-configured Axios instance for proxying requests to the TMDB API v3.
 * Uses TMDB v4 JWT Read Access Token via Authorization header (Bearer token).
 */
const tmdbClient = axios.create({
  baseURL: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  params: {
    language: 'en-US',
  },
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
  },
});

export default tmdbClient;