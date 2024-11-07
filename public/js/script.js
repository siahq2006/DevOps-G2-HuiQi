function showAddMovieForm() {
    document.getElementById('add-movie-modal').style.display = 'flex';
}

function hideAddMovieForm() {
    document.getElementById('add-movie-modal').style.display = 'none';
}

function addMovie() {
    var response = "";
    var jsonData = {};

    // Get form values
    jsonData.movie_name = document.getElementById("movie-name").value.trim();
    jsonData.poster_url = document.getElementById("poster-url").value.trim();
    jsonData.description = document.getElementById("description").value.trim();
    jsonData.genre = document.getElementById("genre-select").value.trim();
    jsonData.rating = document.getElementById("rating").value.trim();
    jsonData.release_date = document.getElementById("release-date").value.trim();
    jsonData.duration = document.getElementById("duration").value.trim();

    // Clear previous error styles and message
    document.getElementById("message").innerHTML = '';
    document.getElementById("message").removeAttribute("class");
    var fields = ["movie-name", "poster-url", "description", "genre-select", "rating", "release-date", "duration"];
    fields.forEach(field => {
        document.getElementById(field).style.border = ""; // Remove any previous red border
    });

    // Validate required fields and highlight if empty
    let allFieldsFilled = true;
    fields.forEach(field => {
        if (jsonData[field.replace('-', '_')] === "") {  // Adjusts jsonData keys to match field IDs
            document.getElementById(field).style.border = "2px solid red";  // Highlight empty field
            allFieldsFilled = false;
        }
    });

    if (!allFieldsFilled) {
        alert("Please fill out all required fields!"); // Notification for missing fields
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    // AJAX request to add movie if all fields are filled
    var request = new XMLHttpRequest();
    request.open("POST", "/addMovie", true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message === undefined) {
            alert("Movie added successfully!"); // Notification for successful addition
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
