import { displayModal, showMovies } from "./ui.js";
import { MOVIE_SEARCH_URL, MOVIES_NOW_PLAYING_URL, getMovieDetailsUrl, getMovieVideosUrl, getMovieReviewsUrl, getSimilarMoviesUrl, } from "./config.js";
const moviesContainer = document.getElementById("movies");

const nowPlaying = document.getElementById("nowPlaying");

let currentPage = 1; // Start from the first page
let isLoading = false; // Prevent multiple simultaneous API calls


//---------------- <Fill MovieContainer> -----------------
async function fetchMovies(page) {
    try {
        nowPlaying.style.display = "block"
        const response = await fetch(MOVIES_NOW_PLAYING_URL + page);
        const data = await response.json();
        showMovies(data.results)
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function searchMovies(value){
    try {
        const response = await fetch(MOVIE_SEARCH_URL + value);
        const searchResult = await response.json();
        showMovies(searchResult.results)
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchMovies(currentPage);

//Debounce input to reduce API requests
let searchTimeout;
document.getElementById('search').addEventListener('input', (event) => {
    moviesContainer.innerHTML = "";
    currentPage = 1
    clearTimeout(searchTimeout);
    nowPlaying.style.display = "none"
    const trimmedValue = event.target.value.trim();
    searchTimeout = setTimeout(() => trimmedValue.length > 0 ? searchMovies(event.target.value) : fetchMovies(1) , 500);
});

//---------------- </Fill MovieContainer> -----------------


//---------------- <Infinite Scroll> -------------------

// Load more movies when scroll to bottom
async function loadMoreMovies() {
    if (isLoading) return; 
    isLoading = true;
    currentPage += 1;
    try {
      await fetchMovies(currentPage);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      isLoading = false;
    }
  }

// Check when scroll reaches bottom
window.addEventListener("scroll", () => {
    if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight){
        loadMoreMovies()
    }
})

//---------------- </Infinite Scroll> ------------------


//---------------- <Fetch More Details> -------------------
export function fetchMovieDetails(movieId) {
    const detailsFetch = fetch(getMovieDetailsUrl(movieId));
    const videoFetch = fetch(getMovieVideosUrl(movieId));
    const reviewsFetch = fetch(getMovieReviewsUrl(movieId));
    const similarVideosFetch = fetch(getSimilarMoviesUrl(movieId));

    return Promise.all([detailsFetch, videoFetch, reviewsFetch, similarVideosFetch])
        .then(responses => {
            // Ensure all responses are successful
            return Promise.all(responses.map(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.url}`);
                }
                return response.json();
            }));
        })
        .then(([details,videos, reviews, similarVideos]) => {
            // Limit reviews to up to 2 responses
            const limitedReviews = reviews.results.slice(0, 2);
            // Return videos if they exist, along with other data
            displayModal({ details, video: videos.results.length ? videos.results[0] : null, reviews: limitedReviews, similarVideos: similarVideos.results})
            })
        .catch(error => {
            console.error('Error fetching resources:', error);
            throw error;
        });
    
}

//---------------- </Fetch More Details> -------------------

