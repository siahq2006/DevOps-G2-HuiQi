const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) { console.error(err); throw err; }
}

async function viewMoviesKai(req, res) {
    try {
        const allMovies = await readJSON('utils/movies.json');
        return res.status(201).json(allMovies);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function getGenresKai(req, res) {
    try {
        const allGenres = await readJSON('utils/genre.json');
        return res.status(200).json(allGenres);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function viewMovieByGenre(req, res) {
    try {
        const genre = req.params.id;  // ID of the genre from the request URL
        const allMovies = await readJSON('utils/movies.json');  // Adjust file path if necessary

        // Filter movies by genre
        const moviesByGenre = allMovies.filter(movie => movie.genre === genre);

        // Check if any movies match the genre ID
        if (moviesByGenre.length > 0) {
            return res.status(200).json(moviesByGenre);
        } else {
            return res.status(404).json({ message: 'No movies found for this genre!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, viewMoviesKai, getGenresKai, viewMovieByGenre
}