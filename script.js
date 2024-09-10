document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");
    const resultContainer = document.getElementById("result-container");
    const watchlistButton = document.getElementById("watchlist-button");

    const apiKey = 'e7e06d5b';  

    function executeSearch() {
        const query = searchInput.value.trim();

        if (query) {
            fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    displayResults(data); 
                })
                .catch(error => {
                    resultContainer.innerHTML = `<p style="color: red;">An error occurred: ${error.message}</p>`;
                });
        } else {
            resultContainer.innerHTML = '<p style="color: red;">Please enter a movie title to search.</p>';
        }
    }

    searchButton.addEventListener("click", executeSearch);
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            executeSearch();
        }
    });

    function displayResults(data) {
        resultContainer.innerHTML = '';  

        if (data && data.Search && data.Search.length > 0) {
            data.Search.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.classList.add('movie-item');

                const coverImageUrl = movie.Poster !== "N/A"
                    ? movie.Poster
                    : 'https://via.placeholder.com/100x150.png?text';

                movieItem.innerHTML = `
                    <div style="display: flex; align-items: center; margin-bottom: 20px; border: 1px solid #ddd; padding: 10px;">
                        <img src="${coverImageUrl}" alt="${movie.Title} cover" style="width: 100px; height: auto; margin-right: 20px;">
                        <div>
                            <h3>${movie.Title}</h3>
                            <p><strong>Year:</strong> ${movie.Year}</p>
                            <button class="details-button" data-imdbid="${movie.imdbID}">Show Details</button>
                            <button class="add-watchlist-button" data-movieid="${movie.imdbID}" data-title="${movie.Title}" data-poster="${coverImageUrl}">Add to Watchlist</button>
                        </div>
                    </div>
                `;

                movieItem.querySelector('.details-button').addEventListener('click', function() {
                    const imdbID = this.getAttribute('data-imdbid');
                    fetchMovieDetails(imdbID);
                });

                movieItem.querySelector('.add-watchlist-button').addEventListener('click', function() {
                    const imdbID = this.getAttribute('data-movieid');
                    const title = this.getAttribute('data-title');
                    const poster = this.getAttribute('data-poster');
                    addToWatchlist(imdbID, title, poster);
                });

                resultContainer.appendChild(movieItem);
            });
        } else {
            resultContainer.innerHTML = '<p>No results found.</p>';
        }
    }

    function fetchMovieDetails(imdbID) {
        fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                resultContainer.innerHTML = `
                    <div style="border: 1px solid #ddd; padding: 20px; background-color: #358597; color: white">
                        <h2>${data.Title}</h2>
                        <img src="${data.Poster !== "N/A" ? data.Poster : 'https://via.placeholder.com/100x150.png?text=No+Image'}" alt="${data.Title} cover" style="width: 150px;">
                        <p><strong>Year:</strong> ${data.Year}</p>
                        <p><strong>Genre:</strong> ${data.Genre}</p>
                        <p><strong>Director:</strong> ${data.Director}</p>
                        <p><strong>Actors:</strong> ${data.Actors}</p>
                        <p><strong>Plot:</strong> ${data.Plot}</p>
                        <button id="back-button">Back to Search Results</button>
                    </div>
                `;

                document.getElementById('back-button').addEventListener('click', executeSearch);
            });
    }

    function addToWatchlist(imdbID, title, poster) {
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        const movie = { imdbID, title, poster };

        if (!watchlist.some(item => item.imdbID === imdbID)) {
            watchlist.push(movie);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            alert(`${title} has been added to your Watchlist`);
        } else {
            alert(`${title} is already in your Watchlist`);
        }
    }

    watchlistButton.addEventListener('click', displayWatchlist);

    function displayWatchlist() {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        resultContainer.innerHTML = '<h2>Your Watchlist</h2>';

        if (watchlist.length > 0) {
            watchlist.forEach(movie => {
                const watchlistItem = document.createElement('div');
                watchlistItem.classList.add('movie-item');

                const coverImageUrl = movie.poster !== "N/A"
                    ? movie.poster
                    : 'https://via.placeholder.com/100x150.png?text';

                watchlistItem.innerHTML = `
                    <div style="display: flex; align-items: center; margin-bottom: 20px; border: 1px solid #ddd; padding: 10px;">
                        <img src="${coverImageUrl}" alt="${movie.title} cover" style="width: 100px; height: auto; margin-right: 20px; ">
                        <div>
                            <h3>${movie.title}</h3>
                            <button class="remove-watchlist-button" data-movieid="${movie.imdbID}">Remove from Watchlist</button>
                        </div>
                    </div>
                `;

                watchlistItem.querySelector('.remove-watchlist-button').addEventListener('click', function() {
                    const imdbID = this.getAttribute('data-movieid');
                    removeFromWatchlist(imdbID);
                });

                resultContainer.appendChild(watchlistItem);
            });
        } else {
            resultContainer.innerHTML += '<p>Your Watchlist is empty.</p>';
        }
    }

    function removeFromWatchlist(imdbID) {
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        displayWatchlist();
    }
});
