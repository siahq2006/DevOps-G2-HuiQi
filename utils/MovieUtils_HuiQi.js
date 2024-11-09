// Import the Movie model and fs.promises for file handling
const { Movie } = require('../models/Movie');
const fs = require('fs').promises;

// Reads a JSON file and parses it into a JavaScript object
async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');   // Read the file as UTF-8
        return JSON.parse(data);     // Parse the file content to JSON and return it
    } catch (err) { console.error(err); throw err; }    // If there's an error, log it and throw it for handling
}

// Writes an object to a JSON file by appending it to existing data
async function writeJSON(object, filename) {
    try {
        // Read current contents of the file
        const allObjects = await readJSON(filename);

        // Append the new object to the current list
        allObjects.push(object);

        // Write the updated list back to the file in UTF-8 format
        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;    // Return the updated list of objects
    } catch (err) { console.error(err); throw err; }       // Handle errors by logging and throwing
}



// Endpoint for adding a new movie
async function addMovie(req, res) {
    try {
        // Extract movie data from the request body
        const movie_name = req.body.movie_name;
        const poster_url = req.body.poster_url;
        const description = req.body.description;
        const genre = req.body.genre;
        const rating = req.body.rating;
        const release_date = req.body.release_date;
        const duration = req.body.duration;

        // Basic validation
        if (description.length < 10 || !genre || !movie_name || !poster_url || !rating || !release_date || !duration) {
            return res.status(500).json({ message: 'Validation error' });
        } else {
            // Create a new Movie instance
            const newMovie = new Movie(movie_name, poster_url, description, genre, rating, release_date, duration);

            // Assuming writeJSON function writes to a JSON file and returns updated list
            const updatedMovies = await writeJSON(newMovie, 'utils/movies.json');
            return res.status(201).json(updatedMovies);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



// Endpoint to fetch all movies from the JSON file
async function viewMovies(req, res) {
    try {
        const allMovies = await readJSON('utils/movies.json');
        return res.status(200).json(allMovies);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// Endpoint to fetch all Genres from the JSON file
async function getGenres(req, res) {
    try {
        const allGenres = await readJSON('utils/genre.json');
        return res.status(200).json(allGenres);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// Export the functions to be used in routes
module.exports = {
    readJSON, writeJSON, addMovie, viewMovies, getGenres
}