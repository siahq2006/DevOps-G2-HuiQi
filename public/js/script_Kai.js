function viewMoviesKai() {
    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', '/viewMoviesKai', true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            response = JSON.parse(request.responseText);
            var html = '';

            for (var i = 0; i < response.length; i++) {
                html += '<div class="movie-item">' +
                    '<img src="' + response[i].poster_url + '" alt="' + response[i].movie_name + '">' +
                    '<div>' + response[i].movie_name + '</div>' +
                    '</div>';
            }

            document.getElementById('tableContent').innerHTML = html;
        } else {
            document.getElementById("message").innerHTML = 'Failed to load movies. Please try again later.';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    request.send();
}

viewMoviesKai();



async function loadGenresKai() {
    const genreSelect = document.getElementById("genre-select");
    genreSelect.innerHTML = '<option value="all">All</option>'; // Default option to show all movies

    try {
        const response = await fetch('/getGenresKai');
        if (!response.ok) {
            throw new Error(`Failed to load genres: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Genres loaded:", data); // Debugging line

        data.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre.id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading genres:', error);
        document.getElementById("message").innerText = 'Failed to load genres.';
        document.getElementById("message").setAttribute("class", "text-danger");
    }
}



async function loadMoviesByGenre() {
    const id = document.getElementById('genre-select').value;

    let url = '/viewMoviesKai'; // Default endpoint to fetch all movies
    if (id !== 'all') {
        url = `/viewMovieByGenre/${id}`; // Endpoint to fetch movies by genre
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load movies: ${response.status} ${response.statusText}`);
        }
        
        const movies = await response.json();

        const tableContent = document.getElementById('tableContent');
        tableContent.innerHTML = ''; // Clear previous content

        if (movies.length === 0) {
            document.getElementById("message").innerText = 'No movies found.';
            return;
        } else {
            document.getElementById("message").innerText = ''; // Clear message
        }

        // Populate movies in the movie grid
        movies.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.className = 'movie-item';

            movieDiv.innerHTML = `
                <img src="${movie.poster_url}" alt="Movie Poster" class="movie-poster">
                <p>${movie.movie_name}</hp>
            `;

            tableContent.appendChild(movieDiv);
        });
    } catch (error) {
        console.error('Error loading movies by genre:', error);
        document.getElementById("message").innerText = 'Failed to load movies.';
    }
}





// Load genres and set up event listener for genre selection
window.onload = function () {
    loadGenresKai(); // Load genres on page load
    document.getElementById('genre-select').addEventListener('change', loadMoviesByGenre); // Trigger movie load on genre change
};