import { fetchMovieDetails } from "./main.js";
import { GENRES_URL } from "./config.js";

const modal = document.getElementById("movieDetails");
const modalContent = document.getElementById("modalContent");
const moviesContainer = document.getElementById("movies");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

//---------------- <Genres> ------------------
async function fetchGenres() {
    try {
        const response = await fetch(GENRES_URL);
        const genres = await response.json();
        return genres

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

let genreArray;
const genreList = (async function () {
  try {
    const genreList = await fetchGenres();
    genreArray = [...genreList.genres];
    return genreList.genres;
  } catch (error) {
    console.error("Failed to fetch resources:", error);
  }
})();

function getGenreNames(genreList,media) {    
    // Map over the genres array and filter based on matching IDs
    const matchedGenreNames = genreList
        ?.filter(genre => media.includes(genre.id))
        .map(genre => genre.name)

    return matchedGenreNames;
}

//---------------- </Genres> ------------------

// Function to display a modal with fetched data
export function displayModal({details, video, reviews, similarVideos}) {
    modal.classList.add("show");
    document.body.classList.add("no-scroll");

    modalContent.innerHTML = `
        <p>${details.original_title}</p>
        <div class="trailer-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${video?.key}" title="${video?.name}"
            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        <p id="reviewsTitle">Reviews</p>
        <div id="reviewsContainer" class="reviews-container"></div>
        <p id="similarTitle">Similar Movies</p>
        <div id="similarContainer" class="similar-container"></div>
    `;
    const reviewsContainer = document.getElementById("reviewsContainer");
    const similarContainer = document.getElementById("similarContainer");

    const reviewsTitle = document.getElementById("reviewsTitle");
    const similarTitle = document.getElementById("similarTitle");

    if(reviews.length){
        reviews.forEach((review) => {
            const reviewsContent = document.createElement("div")
            reviewsContent.classList.add("review-item")
    
            reviewsContent.innerText = `${review.content}
            `
    
            reviewsContainer.appendChild(reviewsContent);
        })
    }else{
        reviewsTitle.style.display = "none"
    }
    
    if(similarVideos.length){
        similarVideos.forEach((similarVideo) => {
            const similarContent = document.createElement("div")
            similarContent.classList.add("similar-item")
    
            // Add click event listener to fetch more details about the similar movie clicked
            similarContent.addEventListener("click", () => {
            fetchMovieDetails(similarVideo.id);
            }); 
    
            similarContent.innerHTML += `
                <img src="https://image.tmdb.org/t/p/w500/${similarVideo.poster_path}" height=100 width=100 class="similar_movie_img">
                <div class="similar-title">${similarVideo.title}</div>
        `
            similarContainer.appendChild(similarContent)
        })
    }else{
        similarTitle.style.display = "none"
    }
    
}

// Function to close the modal
function closeModalFn() {
    modal.classList.remove("show");
    document.body.classList.remove("no-scroll");
}

// Close the modal when clicking outside the modal content
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModalFn();
    }
});

//Fucntion that shows movie cards
export function showMovies(movies) {
    movies.forEach((movie) => {
        movie.genre_ids = getGenreNames(genreArray, movie.genre_ids);
        const { id, poster_path, title, release_date, genre_ids, vote_average, overview } = movie;

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie_item");

        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500/${poster_path}" class="movie_img">
            <div class="movie-info">
                <div class="title">${title}</div>
                <div class="release_date">${new Date(release_date).getFullYear()}</div>
                <div class="genre">${genre_ids}</div>
                <span class="${getClassByRate(vote_average)}">${vote_average.toFixed(2)}</span>
                <div class="overview-container">
                    <p class="overview hidden">${overview}</p>
                </div>
                <button class="view-overview-btn">View Overview</button>
            </div>
        `;

        // Add click event listener to fetch more details
        movieCard.addEventListener("click", () => {
            fetchMovieDetails(id);
        });

        // Append the movie card to the container
        moviesContainer.appendChild(movieCard);

        // Add the event listener for the "View Overview" button
        const overviewButton = movieCard.querySelector(".view-overview-btn");
        const overviewElement = movieCard.querySelector(".overview");

        overviewButton.addEventListener("click", (e) => {
            // Stop propagation to prevent triggering the movieCard click event
            e.stopPropagation();
            if (overviewElement.classList.contains("hidden")) {
                // Show the overview
                overviewElement.classList.remove("hidden");
                overviewElement.classList.add("show");
                overviewButton.textContent = "View Less";
            } else {
                // Hide the overview
                overviewElement.classList.remove("show");
                overviewElement.classList.add("hidden");
                overviewButton.textContent = "View Overview";
            }
        });
    });
}


//Function to color rating score
function getClassByRate(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

document.querySelectorAll('.view-overview-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const movieCard = button.parentElement;
      const overview = movieCard.querySelector('.overview');
  
      if (overview.classList.contains('show')) {
        // Collapse overview
        overview.classList.remove('show');
        button.textContent = 'View Overview';
      } else {
        // Expand overview
        overview.classList.add('show');
        button.textContent = 'View Less';
      }
    });
  });

// Event listener to scroll to the top on page load
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }

// Show or hide the button based on scroll position
window.addEventListener("scroll", () => {
    if (window.scrollY > 800) { // Show the button after scrolling down 300px
        scrollToTopBtn.classList.add("show");
        scrollToTopBtn.classList.remove("hide");
    } else {
        scrollToTopBtn.classList.add("hide");
        scrollToTopBtn.classList.remove("show");
    }
});
// Scroll to the top when the button is clicked
scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Smooth scrolling
    });
});
