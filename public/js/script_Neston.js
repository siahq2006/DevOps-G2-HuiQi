// Show Genre Modal
function showAddGenreForm() {
    document.getElementById("addGenreModal").style.display = "flex"; // This code will display the modal when the button is clicked
    loadGenres();  // Fetch existing genres on modal open
}

// Close Genre Modal
function closeModal() {
    document.getElementById("addGenreModal").style.display = "none"; // This code will close the modal when the close button is clicked
}

// Load and display existing genres with delete option
function loadGenres() {
    fetch('/get-genres')  // Fetch genres from server
        .then(response => response.json()) // Parse response as JSON
        .then(data => { // Process the data
            const genreList = document.getElementById("genreList"); // Get the genre list element
            genreList.innerHTML = ''; // Clear the list first
            
            data.forEach(genre => { // Loop through each genre
                const listItem = document.createElement("div"); // Create a list item
                listItem.classList.add("genre-item"); // Add a class to the list item

                const genreName = document.createElement("span"); // Create a span element for genre name
                genreName.textContent = genre.name; // Set the genre name

                const deleteIcon = document.createElement("img"); // Create an image element for delete icon
                deleteIcon.src = "images/icons/trashcan-icon.png";  // Set the icon image
                deleteIcon.alt = "Delete"; // Set the alt text
                deleteIcon.onclick = () => confirmDeleteGenre(genre.id, genre.name); // Set the click event

                listItem.appendChild(genreName); // Append genre name to list item
                listItem.appendChild(deleteIcon); // Append delete icon to list item
                genreList.appendChild(listItem); // Append list item to genre list
            });
        })
        .catch(error => console.error("Error loading genres:", error)); // Log any errors to the console
}

// Confirm deletion of genre
function confirmDeleteGenre(genreId, genreName) {
    if (confirm(`Are you sure you want to delete the genre: ${genreName}?`)) { // Confirm deletion
        deleteGenre(genreId); // Call delete genre function
    }
}

// Delete Genre function
function deleteGenre(genreId) {
    fetch(`/delete-genre/${genreId}`, { method: 'DELETE' }) 
        .then(response => response.json()) 
        .then(data => { //
            if (data.success) { // Check if deletion was successful
                alert(data.message); // Show success message
                loadGenres();  // Reload genre list after deletion
            } else {
                alert(data.message); // Show error message
            }
        }) 
        .catch(error => console.error("Error deleting genre:", error)); // Log any errors to the console
}


// Add Genre Function
function addGenre() {
    const genreName = document.getElementById("genreInput").value.trim(); // Get genre name from input
    if (!genreName) { // Check if genre name is empty
        alert("Genre name cannot be empty!");
        return;
    }

    // Simulate adding genre to database
    fetch('/add-genre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: genreName })
    })
    .then(response => response.json())
    .then(res => { 
        if (res.success) { // Check if genre was added successfully
            loadGenres();  // Reload genre list
            document.getElementById("genreInput").value = ""; // Clear input
        } else {
            alert("Failed to add genre: " + res.message); // Show error message
        }
    })
    .catch(error => {
        console.error("Error adding genre:", error); // Log any errors to the console
        alert("Network error: Unable to add genre at this time. Please try again later."); // Show error message
    });
}
