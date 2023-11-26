//Graphica Project

const key = 'cd3415d2';

var searchInput = document.getElementById('Input');
var displaySearchList = document.getElementsByClassName('fav-container');

fetch('http://www.omdbapi.com/?i=tt3896198&apikey=cd3415d2')
    .then(res => res.json())
    .then(data => console.log(data));

// Upon keypress - function findMovies is initiated
searchInput.addEventListener('input', findMovies);


async function singleMovie() {


    // Finding ID of the movie from the URL
    var urlQueryParams = new URLSearchParams(window.location.search);
    var id = urlQueryParams.get('id')
    console.log(id);
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`
    const res = await fetch(`${url}`);
    const data = await res.json();
    console.log(data);
    console.log(url);

    // Making the output html by string interpolition
    var output = `

    <div class="movie-poster">
        <img src=${data.Poster} alt="Movie Poster">
    </div>
    <div class="movie-details">
        <div class="details-header">
            <div class="dh-ls">
                <h1 >${data.Title}</h1>
            </div>
            <div class="dh-rs">
                <i class="fa-solid fa-bookmark" onClick=addTofavorites('${id}') style="cursor: pointer; font-size: 30px;"></i>
            </div>
        </div>
        <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                    style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
        <ul class="details-ul">
            <li><strong>Actors: </strong>${data.Actors}</li>
            <li><strong>Director: </strong>${data.Director}</li>
            <li><strong>Writers: </strong>${data.Writer}</li>
        </ul>
        <ul class="details-ul">
            <li><strong>Genre: </strong>${data.Genre}</li>
            <li><strong>Release Date: </strong>${data.DVD}</li>
            <li><strong>Box Office: </strong>${data.BoxOffice}</li>
            <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
        </ul>
        <p style="font-size: 20px; margin-top:10px;">${data.Plot}</p>
        <p style="font-size: 20px; font-style: italic; color: #222; margin-top: 10px;">
            <i class="fa-solid fa-award"></i>
            &thinsp; ${data.Awards}
        </p>
    </div> 
    `
    // Appending the output
    document.querySelector('.movie-container').innerHTML = output


}

async function addTofavorites(id) {
    console.log("fav-item", id);

    localStorage.setItem(Math.random().toString(36).slice(2, 7), id);// math.random for the unique key and value pair
    alert('Movie Added to Watchlist!');
}

//Removing the movie from the favorites list  and also from the localstorage
async function removeFromfavorites(id) {
    console.log(id);
    for (i in localStorage) {
        // If the ID passed as argument matches with value associated with key, then removing it 
        if (localStorage[i] == id) {
            localStorage.removeItem(i)
            break;
        }
    }
    //Alerting the user and refreshing the page
    alert('Movie Removed from Watchlist');
    window.location.replace('favorite.html');
}

//Displaying the movie list on the search page according to the user list
async function displayMovieList(movies) {
    var output = '';
    //Traversing over the movies list which is passed as an argument to our function
    for (i of movies) {
        const url = `https://www.omdbapi.com/?i=${i.imdbID}&apikey=${key}`
        const res = await fetch(`${url}`);
        var resJ =await res.json();
        console.log(resJ)
        var plot =await resJ.Plot;
        console.log(plot)
        var img = '';
        if (i.Poster != 'N/A') {
            img = i.Poster;
        }
        else {
            img = 'img/blank-poster.webp';
        }
        var id = i.imdbID;

        //Appending the output through string interpolition
        output += `

        <div class="fav-item">
                <div class="fav-card-container">
                    <div class="card-face front">
                        <div class="fav-poster">
                            <a href="movie.html?id=${id}"><img
                                    src=${img}
                                    alt="Favourites Poster"></a>
                        </div>
                        <div class="fav-details">
                            <div class="fav-details-box">
                                <div>
                                    <p class="fav-movie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                                    <p class="fav-movie-rating"><a href="movie.html?id=${id}">${i.Year}</a></p>
                                </div>

                                <div>
                                    <i class="fa-solid fa-bookmark" style="cursor:pointer;"
                                        onclick="addTofavorites('${id}')"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-face back">
                        <h1><strong>Plot: </strong></h1>
                        <br>
                        <p class="fav-movie-plot">${plot}</p>
                    </div>
                </div>
            </div>

       `
    }
    //Appending this to the movie-display class of our html page
    document.querySelector('.fav-container').innerHTML = output;
    console.log("here is movie list ..", movies);
}


//When the user is searching for the movie then a list of the related movie will be displayed and that list is fetched
async function findMovies() {
    const url = `https://www.omdbapi.com/?s=${(searchInput.value).trim()}&page=1&apikey=${key}`
    const res = await fetch(`${url}`);
    const data = await res.json();

    if (data.Search) {
        //Calling the function to display list of the movies related to the user search
        displayMovieList(data.Search)
    }
}

//Favorites movies are loaded on to the fav page from localstorage
async function favoritesMovieLoader() {

    var output = ''
    //Traversing over all the movies in the localstorage
    for (i in localStorage) {
        var id = localStorage.getItem(i);
        if (id != null) {
            //Fetching the movie through id 
            const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`
            const res = await fetch(`${url}`);
            const data = await res.json();
            console.log(data);


            var img = ''
            if (data.Poster) {
                img = data.Poster
            }
            else { img = data.Title }
            var Id = data.imdbID;
            //Adding all the movie html in the output using interpolition
            output += `

        <div class="fav-item">
            <div class="fav-poster">
                <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name">${data.Title}</p>
                        <p class="fav-movie-rating">${data.Year} &middot; <span
                                style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                    </div>
                    <div style="color: maroon">
                        <i class="fa-solid fa-trash" style="cursor:pointer;" onClick=removeFromfavorites('${Id}')></i>
                    </div>
                </div>
            </div>
        </div>

       `;
        }

    }
    //Appending the html to the movie-display class in favorites page 
    document.querySelector('.fav-container').innerHTML = output;
}

let currentIndex = 0;

function nextSlide() {
    currentIndex = (currentIndex + 1) % document.querySelectorAll('.slide').length;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + document.querySelectorAll('.slide').length) % document.querySelectorAll('.slide').length;
    updateSlider();
}

function updateSlider() {
    const slider = document.querySelector('.slider');
    const slideWidth = document.querySelector('.slide').offsetWidth;
    slider.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
}
// Function to start the automatic slider transition
function startSliderInterval() {
    slideInterval = setInterval(() => {
        nextSlide();
    }, 3000); // Change the interval (in milliseconds) as needed
}

// Function to stop the automatic slider transition
function stopSliderInterval() {
    clearInterval(slideInterval);
}

window.onload = function () {
    startSliderInterval();
    // Hide the search bar during loading overlay
    document.querySelector('.search-box').style.display = 'none';
    
        // Get the search input element
    var searchInput = document.getElementById('Input');

        // Set the default value
    searchInput.value = "Avengers";

        // Perform an initial search with the default query
    findMovies();

    

    setTimeout(function () {
        // Hide the loading overlay
        document.querySelector('.loading-overlay').style.display = 'none';

        // Show the search bar
        document.querySelector('.search-box').style.display = 'flex';

        // Display the slides
        document.querySelector('.slider-container').style.display = 'block';

        // Fade in the body content by setting opacity to 1
        document.body.style.opacity = 1;

        // Additional logic for your slider or other functionality
    }, 1000);
}





