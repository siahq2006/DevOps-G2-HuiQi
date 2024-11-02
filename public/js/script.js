function showAddMovieForm() {
    document.getElementById('add-movie-modal').style.display = 'flex';
}

function hideAddMovieForm() {
    document.getElementById('add-movie-modal').style.display = 'none';
}

function addMovie() {
    var response = "";
    var jsonData = {};

    jsonData.movie_name = document.getElementById("movie-name").value;
    jsonData.poster_url = document.getElementById("poster-url").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.genre = document.getElementById("genre-select").value;
    jsonData.rating = document.getElementById("rating").value;
    jsonData.release_date = document.getElementById("release-date").value;
    jsonData.duration = document.getElementById("duration").value;

    if (jsonData.movie_name == "" || jsonData.poster_url == "" || jsonData.description == "" || jsonData.genre == "") {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();
    request.open("POST", "/addMovie", true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message === undefined) {
            document.getElementById("message").innerHTML = 'Added Movie: ' + jsonData.movie_name + '!';
            document.getElementById("message").setAttribute("class", "text-success");
            hideAddMovieForm();
            viewMovies(); // Refresh the movie list
        } else {
            document.getElementById("message").innerHTML = 'Unable to add movie! ' + response.message;
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    request.send(JSON.stringify(jsonData));
}

function viewMovies() {
    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', '/viewMovies', true);
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

viewMovies();

function loadGenres() {
    const genreSelect = document.getElementById("genre-select");

    fetch('/getGenres')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load genres: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(genre => {
                const option = document.createElement("option");
                option.value = genre.id;
                option.textContent = genre.name;
                genreSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("message").innerHTML = 'Failed to load genres.';
            document.getElementById("message").setAttribute("class", "text-danger");
        });
}

// Load genres when the DOM is ready
document.addEventListener('DOMContentLoaded', loadGenres);
