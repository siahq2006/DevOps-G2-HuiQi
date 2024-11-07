const { Movie } = require('../models/Movie_jasper.js'); // Import the Movie class
const fs = require('fs').promises; // Import the promises version of the fs module

async function readJSON(filename) { // Function to read JSON file
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function writeJSON(object, filename) { // Function to write JSON file
    try {
        await fs.writeFile(filename, JSON.stringify(object, null, 2), 'utf8');
        return object;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function loadGenres(req, res) { // Function to load genres
    try {

        const genres = await readJSON('utils/genre.json');
        return res.status(200).json(genres);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


async function viewMovies(req, res) { // Function to view all movies
    try {
        const allMovies = await readJSON('utils/Movie_jasper.js');
        return res.status(200).json(allMovies);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function viewMovieById(req, res) { // Function to view movie by id
    try {
        const id = req.params.id;
        const allMovies = await readJSON('utils/Movie_jasper.js');
        const movie = allMovies.find(movie => movie.id === id);

        if (movie) {
            return res.status(200).json(movie);
        } else {
            return res.status(404).json({ message: 'Movie not found!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function editMovie(req, res) { // Function to edit movie by id
    try {
        const id = req.params.id;
        const { movie_name, poster_url, description, genre, rating, release_date, duration } = req.body;

        const allMovies = await readJSON('utils/Movie_jasper.js');
        let modified = false;

        for (let i = 0; i < allMovies.length; i++) {
            const currentMovie = allMovies[i];

            if (currentMovie.id === id) {
                allMovies[i] = {
                    ...currentMovie,
                    movie_name,
                    poster_url,
                    description,
                    genre,
                    rating,
                    release_date,
                    duration
                };
                modified = true;
                break;
            }
        }

        if (modified) {
            await writeJSON(allMovies, 'utils/Movie_jasper.js');
            return res.status(200).json({ message: 'Movie modified successfully!' });
        } else {
            return res.status(404).json({ message: 'Movie not found, unable to modify!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteMovie(req, res) { // Function to delete movie by id
    try {
        const id = req.params.id;
        const allMovies = await readJSON('utils/Movie_jasper.js');

        const index = allMovies.findIndex(movie => movie.id === id);

        if (index !== -1) {
            allMovies.splice(index, 1);
            await writeJSON(allMovies, 'utils/Movie_jasper.js');
            return res.status(200).json({ message: 'Movie deleted successfully!' });
        } else {
            return res.status(404).json({ message: 'Movie not found, unable to delete!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { readJSON, writeJSON, viewMovies, viewMovieById, editMovie, deleteMovie, loadGenres   };
