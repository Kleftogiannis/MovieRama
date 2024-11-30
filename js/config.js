// config.js
export const API_KEY = 'bc50218d91157b1ba4f142ef7baaa6a0';
export const API_BASE_URL = 'https://api.themoviedb.org/3';
export const GENRES_URL = `${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
export const MOVIES_NOW_PLAYING_URL = `${API_BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=`;
export const MOVIE_SEARCH_URL = `${API_BASE_URL}/search/movie?&api_key=${API_KEY}&query=`;
export const getMovieDetailsUrl = (movieId) => `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
export const getMovieVideosUrl = (movieId) => `${API_BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;
export const getMovieReviewsUrl = (movieId) => `${API_BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}`;
export const getSimilarMoviesUrl = (movieId) => `${API_BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`;
