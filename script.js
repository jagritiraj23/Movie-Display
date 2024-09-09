document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");
    const resultContainer = document.getElementById("result-container");
    const body = document.body;

    const apiKey = 'e7e06d5b';  

    function executeSearch() {

        const query = searchInput.value.trim();

        document.querySelectorAll("h2, h3, p").forEach(element => {
            element.style.color = "black";
        });

        if (query) {
            fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Received data:", data);
                    displayResults(data); 
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    resultContainer.innerHTML = `<p style="color: red;">An error occurred while fetching data: ${error.message}</p>`;
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
                    : 'https://via.placeholder.com/100x150.png?text=No+Image';

                const description = movie.Year ? movie.Year : 'No year available.';

                movieItem.innerHTML = `
                    <div style="display: flex; align-items: center; margin-bottom: 20px; border: 1px solid #ddd; padding: 10px;">
                        <img src="${coverImageUrl}" alt="${movie.Title} cover" style="width: 100px; height: auto; margin-right: 20px;">
                        <div>
                            <h3 style="margin: 0;">${movie.Title}</h3>
                            <p style="margin: 5px 0;"><strong>Year:</strong> ${description}</p>
                            <button class="details-button" data-imdbid="${movie.imdbID}">Show Details</button>
                        </div>
                    </div>
                `;

                movieItem.querySelector('.details-button').addEventListener('click', function() {
                    const imdbID = this.getAttribute('data-imdbid');
                    fetchMovieDetails(imdbID);
                });

                resultContainer.appendChild(movieItem);
            });
        } else {
            resultContainer.innerHTML = '<p>No results found.</p>';
        }
    }

    function fetchMovieDetails(imdbID) {
        fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Movie Details:", data);

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

                const backButton = document.getElementById('back-button');
                backButton.addEventListener('click', function() {
                    executeSearch();   
                });
            })
    }
});
