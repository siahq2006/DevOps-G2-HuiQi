const { Movie } = require('../models/Movie_jasper.js');
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) { console.error(err); throw err; }
}

async function writeJSON(object, filename) {
    try {
        await fs.writeFile(filename, JSON.stringify(object), 'utf8');
        return object;
    } catch (err) { console.error(err); throw err; }
}

async function viewMovies(req, res) {
    try {
        const allMovies = await readJSON('utils/Movie_jasper.js');
        return res.status(200).json(allMovies);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function editMovie(req, res) {
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
           
            await fs.writeFile('utils/Movie_jasper.js', JSON.stringify(allMovies, null, 2), 'utf8');
            return res.status(200).json({ message: 'Movie modified successfully!' });
        } else {
            return res.status(404).json({ message: 'Movie not found, unable to modify!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteMovie(req, res) {
    try {
        const id = req.params.id;
        const allMovies = await readJSON('utils/Movie_jasper.js');
        
      
        const index = allMovies.findIndex(movie => movie.id === id);
        
        if (index !== -1) {
          
            allMovies.splice(index, 1);
            
           
            await fs.writeFile('utils/Movie_jasper.js', JSON.stringify(allMovies, null, 2), 'utf8');
            return res.status(200).json({ message: 'Movie deleted successfully!' });
        } else {
            return res.status(404).json({ message: 'Movie not found, unable to delete!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



module.exports = { readJSON, writeJSON, editMovie,  viewMovies, deleteMovie };