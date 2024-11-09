// // Show the Add Movie form (modal)
// function showAddMovieForm() {
//     document.getElementById('add-movie-modal').style.display = 'flex';
// }

// Show the Add Movie form (modal)
function showAddMovieForm() {
    // Clear previous options from genre dropdown to avoid duplicates
    const genreSelect = document.getElementById("genre-select1");
    genreSelect.innerHTML = '';

    // Load genres dynamically each time the form is displayed
    loadGenres();

    // Display the modal
    document.getElementById('add-movie-modal').style.display = 'flex';
}


// Hide the Add Movie form (modal)
function hideAddMovieForm() {
    document.getElementById('add-movie-modal').style.display = 'none';
}

// Function to add a new movie
function addMovie() {
    var response = "";
    var jsonData = {};

    // Get form values and trim any extra spaces
    jsonData.movie_name = document.getElementById("movie-name").value.trim();
    jsonData.poster_url = document.getElementById("poster-url").value.trim();
    jsonData.description = document.getElementById("description").value.trim();
    jsonData.genre = document.getElementById("genre-select1").value.trim();
    jsonData.rating = document.getElementById("rating").value.trim();
    jsonData.release_date = document.getElementById("release-date").value.trim();
    jsonData.duration = document.getElementById("duration").value.trim();

    // Clear previous error styles and message
    document.getElementById("message").innerHTML = '';
    document.getElementById("message").removeAttribute("class");

    // List of fields to validate
    var fields = ["movie-name", "poster-url", "description", "genre-select1", "rating", "release-date", "duration"];

    // Loop through fields and check if they are empty
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

    // If any fields are empty, show alert and return
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

    // Handle response after the request is complete
    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message === undefined) {
            alert("Movie added successfully!"); // Notification for successful addition
            document.getElementById("message").innerHTML = 'Added Movie: ' + jsonData.movie_name + '!';
            document.getElementById("message").setAttribute("class", "text-success");
            hideAddMovieForm();   // Close the modal
            viewMovies(); // Refresh the movie list
        } else {
            // If there is an error, display the error message
            document.getElementById("message").innerHTML = 'Unable to add movie! ' + response.message;
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    // Send the data to the server
    request.send(JSON.stringify(jsonData));
}

// Function to fetch and display the list of movies
function viewMovies_HuiQi() {
    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', '/viewMovies_HuiQi', true);      // Fetch movie data from the server
    request.setRequestHeader('Content-Type', 'application/json');

    // Handle the response once the request completes
    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {     // Check if request was successful
            response = JSON.parse(request.responseText);
            var html = '';

            // Loop through the response data and create HTML for each movie
            for (var i = 0; i < response.length; i++) {
                html += '<div class="movie-item">' +
                    '<img src="' + response[i].poster_url + '" alt="' + response[i].movie_name + '">' +
                    '<div>' + response[i].movie_name + '</div>' +
                    '</div>';
            }

            // Insert the generated HTML into the 'tableContent' div
            document.getElementById('tableContent').innerHTML = html;
        } else {
            // If request fails, show error message
            document.getElementById("message").innerHTML = 'Failed to load movies. Please try again later.';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    // Send the request
    request.send();
}


// Call viewMovies to display movies on page load
viewMovies();

// Function to load genres from the server and populate the genre dropdown
function loadGenres() {
    const genreSelect = document.getElementById("genre-select1");

    // Fetch genres from the server
    fetch('/getGenres_HuiQi')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load genres: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Loop through genres and create options for the dropdown
            data.forEach(genre => {
                const option = document.createElement("option");
                option.value = genre.id;     // Set the option value to the genre ID
                option.textContent = genre.name;    // Set the option text to the genre name
                genreSelect.appendChild(option);    // Add the option to the select dropdown
            });
        })
        .catch(error => {
            // If error occurs while fetching genres, display error message
            console.error('Error:', error);
            document.getElementById("message").innerHTML = 'Failed to load genres.';
            document.getElementById("message").setAttribute("class", "text-danger");
        });
}

// Load genres when the DOM is ready
document.addEventListener('DOMContentLoaded', loadGenres);
