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
    var jsonData = {};

    // Get form values and trim any extra spaces
    jsonData.movie_name = document.getElementById("movie-name").value.trim();
    jsonData.poster_url = document.getElementById("poster-url").value.trim();
    jsonData.description = document.getElementById("description").value.trim();
    jsonData.genre = document.getElementById("genre-select1").value.trim();
    jsonData.rating = document.getElementById("rating").value.trim();
    jsonData.release_date = document.getElementById("release-date").value.trim();
    jsonData.duration = document.getElementById("duration").value.trim();

    // Clear previous error messages
    var errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(function (msg) {
        msg.remove(); // Remove all previous error messages
    });

    // List of fields to validate
    var fields = ["movie-name", "poster-url", "description", "genre-select1", "rating", "release-date", "duration"];
    let allFieldsValid = true;

    // Validate required fields and highlight if empty
    fields.forEach(field => {
        var fieldElement = document.getElementById(field);
        var fieldValue = jsonData[field.replace('-', '_')];

        if (fieldValue === "") {
            allFieldsValid = false;

            // Create error message under the field
            var errorMessage = document.createElement("div");
            errorMessage.classList.add("error-message");
            errorMessage.style.color = "red"; // Customize color
            errorMessage.style.marginTop = "5px"; // Add some spacing
            errorMessage.innerHTML = "This field is required!";

            // Insert the error message right below the field
            fieldElement.insertAdjacentElement('afterend', errorMessage);
        }
    });

    // Check if description is at least 10 characters long
    var descriptionField = document.getElementById("description");
    if (jsonData.description.length < 10) {
        allFieldsValid = false;

        // Create error message under the description field
        var errorMessage = document.createElement("div");
        errorMessage.classList.add("error-message");
        errorMessage.style.color = "red"; // Customize color
        errorMessage.style.marginTop = "5px"; // Add some spacing
        errorMessage.innerHTML = "Description must be at least 10 characters long!";

        // Insert the error message right below the description field
        descriptionField.insertAdjacentElement('afterend', errorMessage);
    }

    // URL validation for poster_url
    var posterUrlField = document.getElementById("poster-url");
    var urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i; // Basic URL validation regex
    if (!urlRegex.test(jsonData.poster_url)) {
        allFieldsValid = false;

        // Create error message for invalid URL
        var errorMessage = document.createElement("div");
        errorMessage.classList.add("error-message");
        errorMessage.style.color = "red"; // Customize color
        errorMessage.style.marginTop = "5px"; // Add some spacing
        errorMessage.innerHTML = "Please enter a valid URL for the poster!";

        // Insert the error message right below the poster-url field
        posterUrlField.insertAdjacentElement('afterend', errorMessage);
    }

    // Stop submission if any validation fails
    if (!allFieldsValid) {
        return; // Error messages are already displayed
    }

    // AJAX request to add movie if all fields are valid
    var request = new XMLHttpRequest();
    request.open("POST", "/addMovie", true);
    request.setRequestHeader('Content-Type', 'application/json');

    // Handle response after the request is complete
    request.onload = function () {
        var response = JSON.parse(request.responseText);
        if (response.message === undefined) {
            document.getElementById("message").innerHTML = 'Added Movie: ' + jsonData.movie_name + '!';
            document.getElementById("message").setAttribute("class", "text-success");
            hideAddMovieForm(); // Close the modal
            viewMovies(); // Refresh the movie list
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
                return; // Stop execution if the response is not ok
            }
            return response.json();
        })
        .then(data => {
            // Clear existing options before adding new ones (optional)
            genreSelect.innerHTML = '<option value="" disabled selected>Select a genre</option>';

            // Loop through genres and create options for the dropdown
            data.forEach(genre => {
                const option = document.createElement("option");
                option.value = genre.id; // Set the option value to the genre ID
                option.textContent = genre.name; // Set the option text to the genre name
                genreSelect.appendChild(option); // Add the option to the select dropdown
            });

            // Display a success message (optional for debugging)
            document.getElementById("message").innerHTML = 'Genres loaded successfully.';
            document.getElementById("message").setAttribute("class", "text-success");
        });
}



// Load genres when the DOM is ready
document.addEventListener('DOMContentLoaded', loadGenres);
