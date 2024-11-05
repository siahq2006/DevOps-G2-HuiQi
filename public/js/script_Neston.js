// Show Modal
function showAddGenreForm() {
    document.getElementById("addGenreModal").style.display = "flex";
    loadGenres();  // Fetch existing genres on modal open
}

// Close Modal
function closeModal() {
    document.getElementById("addGenreModal").style.display = "none";
}

// Load and display existing genres with delete option
function loadGenres() {
    fetch('/get-genres')  // Replace with actual API endpoint
        .then(response => response.json())
        .then(data => {
            const genreList = document.getElementById("genreList");
            genreList.innerHTML = ''; // Clear the list first
            
            data.forEach(genre => {
                const listItem = document.createElement("div");
                listItem.classList.add("genre-item");

                const genreName = document.createElement("span");
                genreName.textContent = genre.name;

                const deleteIcon = document.createElement("img");
                deleteIcon.src = "images/icons/trashcan-icon.png";  // Add path to your trashcan icon
                deleteIcon.alt = "Delete";
                deleteIcon.onclick = () => confirmDeleteGenre(genre.id, genre.name);

                listItem.appendChild(genreName);
                listItem.appendChild(deleteIcon);
                genreList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error loading genres:", error));
}

// Confirm deletion of genre
function confirmDeleteGenre(genreId, genreName) {
    if (confirm(`Are you sure you want to delete the genre: ${genreName}?`)) {
        deleteGenre(genreId);
    }
}

// Delete Genre function
function deleteGenre(genreId) {
    fetch(`/delete-genre/${genreId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                loadGenres();  // Reload genre list after deletion
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error("Error deleting genre:", error));
}


// Add Genre Function
function addGenre() {
    const genreName = document.getElementById("genreInput").value.trim();
    if (!genreName) {
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
        if (res.success) {
            loadGenres();  // Reload genre list
            document.getElementById("genreInput").value = ""; // Clear input
        } else {
            alert("Failed to add genre: " + res.message);
        }
    })
    .catch(error => {
        console.error("Error adding genre:", error);
        alert("Network error: Unable to add genre at this time. Please try again later.");
    });
}
