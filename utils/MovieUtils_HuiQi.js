// Import the Movie model and fs.promises for file handling
const { Movie } = require('../models/Movies.js');
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
        const { movie_name, poster_url, description, genre, rating, release_date, duration } = req.body;

        // Basic validation: check if all fields are provided
        if (!description || !genre || !movie_name || !poster_url || !rating || !release_date || !duration) {
            return res.status(400).json({ message: 'All fields are required!' });
        } else if (description.length < 10) {
            return res.status(400).json({ message: 'Description must be at least 10 characters long!' });
        } else if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be a number between 1 and 5!' });
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(release_date)) {
            return res.status(400).json({ message: 'Release date must be in the format YYYY-MM-DD!' });
        } else if (!Number.isInteger(Number(duration)) || duration <= 0) {
            return res.status(400).json({ message: 'Duration must be a positive integer!' });
        }

        // Create a new Movie instance
        const newMovie = new Movie(movie_name, poster_url, description, genre, rating, release_date, duration);

        // Assuming writeJSON function writes to a JSON file and returns updated list
        const updatedMovies = await writeJSON(newMovie, 'utils/movies.json');
        return res.status(201).json(updatedMovies);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



// Endpoint to fetch all movies from the JSON file
async function viewMovies_HuiQi(req, res) {
    try {
        const allMovies = await readJSON('utils/movies.json');
        return res.status(200).json(allMovies);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Endpoint to fetch all Genres from the JSON file
async function getGenres_HuiQi(req, res) {
    try {
        const allGenres = await readJSON('utils/genre.json');
        return res.status(200).json(allGenres);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// Export the functions to be used in routes
module.exports = {
    readJSON, writeJSON, addMovie, viewMovies_HuiQi, getGenres_HuiQi
}