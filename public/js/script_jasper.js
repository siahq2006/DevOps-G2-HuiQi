// Function to fetch and display movies
function viewMovies() {
    var request = new XMLHttpRequest();
    request.open('GET', '/viewMovies', true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            var response = JSON.parse(request.responseText);
            var html = '';

            for (var i = 0; i < response.length; i++) {
                html += '<div class="movie-item">' +
                    '<a href="update-movie.html?id=' + response[i].id + '">' + // Redirect to movie detail page with movie ID
                    '<img src="' + response[i].poster_url + '" alt="' + response[i].movie_name + '">' +
                    '</a>' +
                    '<div>' + response[i].movie_name + '</div>' +
                    '</div>';
            }

            document.getElementById('tableContent').innerHTML = html;
        } else {
            console.error('Error fetching movies:', request.statusText);
            document.getElementById("message").innerHTML = 'Failed to load movies. Please try again later.';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    request.send();
}

// Function to load movie details for editing
function loadMovieForUpdate(movieId) {
    var request = new XMLHttpRequest();
    request.open('GET', '/viewMovies/' + movieId, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            var movie = JSON.parse(request.responseText);
            document.getElementById('movie-name').value = movie.movie_name;
            document.getElementById('poster-url-input').value = movie.poster_url;
            document.getElementById('description').value = movie.description;
            document.getElementById('genre-select').value = movie.genre;
            document.getElementById('rating').value = movie.rating;
            document.getElementById('release-date').value = movie.release_date;
            document.getElementById('duration').value = movie.duration;

            // Set the movie poster
            document.getElementById('poster-img').src = movie.poster_url;
        } else {
            console.error('Error fetching movie details:', request.statusText);
            document.getElementById("message").innerHTML = 'Failed to load movie details. Please try again later.';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    request.send();
}

// Function to update movie details
function updateMovie() {
    const movieId = new URLSearchParams(window.location.search).get('id');
    const updatedMovie = {
        movie_name: document.getElementById('movie-name').value,
        poster_url: document.getElementById('poster-url-input').value,
        description: document.getElementById('description').value,
        genre: document.getElementById('genre-select').value,
        rating: document.getElementById('rating').value,
        release_date: document.getElementById('release-date').value,
        duration: document.getElementById('duration').value
    };

    // Send updated movie details to the server
    var request = new XMLHttpRequest();
    request.open('PUT', '/editMovie/' + movieId, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            alert('Movie updated successfully!');
            window.location.href = 'index.html'; // Redirect back to the movie list
        } else {
            console.error('Error updating movie:', request.statusText);
            document.getElementById("message").innerHTML = 'Failed to update movie. Please try again later.';
        }
    };

    request.send(JSON.stringify(updatedMovie));
}

// Function to load movie details on the detail page
function loadMovieDetails() {
    const movieId = new URLSearchParams(window.location.search).get('id');
    
    if (!movieId) {
        document.getElementById("message").innerText = 'No movie ID provided.';
        return;
    }

    var request = new XMLHttpRequest();
    request.open('GET', '/viewMovies/' + movieId, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            var movie = JSON.parse(request.responseText);
            document.getElementById('movie-name').innerText = movie.movie_name;
            document.getElementById('description').innerText = movie.description;
            document.getElementById('genre').innerText = movie.genre;
            document.getElementById('rating').innerText = movie.rating;
            document.getElementById('release-date').innerText = movie.release_date;
            document.getElementById('duration').innerText = movie.duration;
            document.getElementById('poster-img').src = movie.poster_url;
        } else {
            console.error('Error fetching movie details:', request.statusText);
            document.getElementById("message").innerText = 'Failed to load movie details. Please try again later.';
        }
    };

    request.send();
}

// Call viewMovies on page load to display existing movies or load movie details
window.onload = function () {
    if (document.getElementById('tableContent')) {
        viewMovies(); // Display movies on home page
    } else if (document.getElementById('movie-details')) {
        loadMovieDetails(); // Load movie details for the detail page
    } else {
        const params = new URLSearchParams(window.location.search);
        const movieId = params.get('id');

        if (movieId) {
            loadMovieForUpdate(movieId); // Load movie details for editing
        }
    }
};

// Function to delete a movie
function deleteMovie() {
    const movieId = new URLSearchParams(window.location.search).get('id');

    if (!movieId) {
        alert('No movie ID provided for deletion.');
        return;
    }

    var request = new XMLHttpRequest();
    request.open('DELETE', '/deleteMovie/' + movieId, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            alert('Movie deleted successfully!');
            window.location.href = 'index.html'; // Redirect back to the movie list
        } else {
            console.error('Error deleting movie:', request.statusText);
            document.getElementById("message").innerHTML = 'Failed to delete movie. Please try again later.';
        }
    };

    request.send();
}

// Function to confirm deletion of a movie
function confirmDelete() {
    if (confirm("Are you sure you want to delete this movie? This action cannot be undone.")) {
        deleteMovie(); // Call the deleteMovie function if confirmed
    }
}
