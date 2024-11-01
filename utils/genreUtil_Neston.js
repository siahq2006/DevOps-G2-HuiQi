const { Genre } = require('../models/genres_model_Neston.js');
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
async function addGenre(req, res) {
    try {
        const name = req.body.name;

        // Validation: Check if 'name' contains only alphabetical characters and has a minimum length
        if (!/^[A-Za-z]+$/.test(name) ) {
            return res.status(400).json({ message: 'Validation error: Name must be alphabetical.' });
        }

        // if name is too long
        if (name.length > 10) {
            return res.status(400).json({ message: 'Validation error: Name must be less than 11 characters long.' });
        }

        //if name already exists
        const allGenres = await readJSON('utils/Genres_Neston.js');
        const found = allGenres.find(genre => genre.name === name);
        if (found) {
            return res.status(400).json({ message: 'Validation error: Name already exists.' });
        }

        const newGenre = new Genre(name);
        const updatedGenre = await writeJSON(newGenre, 'utils/Genres_Neston.js');
        
        return res.status(201).json(newGenre);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteGenre(req, res) {
    try {
        const id = req.params.id;
        
        const allGenres = await readJSON('utils/Genres_Neston.js');
        var index = -1;
        
        for (var i = 0; i < allGenres.length; i++) {
            var curcurrGenre = allGenres[i];
            if (curcurrGenre.id == id)
                index = i;
        }
        
        if (index != -1) {
            allGenres.splice(index, 1);
            await fs.writeFile('utils/Genres_Neston.js', JSON.stringify(allGenres), 'utf8');
            return res.status(201).json({ message: 'Genre deleted successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to delete!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, addGenre, deleteGenre
};