const { Movie } = require('../models/Movie');
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) { console.error(err); throw err; }
}

async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);

        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) { console.error(err); throw err; }
}

async function addMovie(req, res) {
    try {
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


module.exports = {
    readJSON, writeJSON, addMovie, viewMovies
}