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

async function getGenres(req, res) {
    try {
        const allResources = await readJSON('utils/genre.json');
        return res.status(201).json(allResources);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function addGenre(req, res) {
    try {
        const name = req.body.name;

        // Validation: Check if 'name' contains only alphabetical characters and has a minimum length
        if (!name || !/^[A-Za-z]+$/.test(name)) {
            return res.status(400).json({ success: false, message: 'Name must be alphabetical.' });
        }

        // if name is too long
        if (name.length > 10) {
            return res.status(400).json({ success: false, message: 'Name must be less than 11 characters long.' });
        }

        // if name already exists
        const allGenres = await readJSON('utils/genre.json');
        if (Array.isArray(allGenres) && allGenres.find(genre => genre.name === name)) {
            return res.status(400).json({ success: false, message: 'Name already exists.' });
        }

        const newGenre = new Genre(name);
        const updatedGenre = await writeJSON(newGenre, 'utils/genre.json');
        
        return res.status(201).json({ success: true, genre: newGenre });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function deleteGenre(req, res) {
    try {
        const id = req.params.id;
        const allGenres = await readJSON('utils/genre.json');
        
        // Find index of the genre to delete
        const index = allGenres.findIndex(genre => genre.id === id);
        
        if (index !== -1) {
            // Remove the genre at the found index
            allGenres.splice(index, 1);
            
            // Write the updated list back to the file
            await fs.writeFile('utils/genre.json', JSON.stringify(allGenres), 'utf8');
            return res.status(200).json({ success: true, message: 'Genre deleted successfully!' });
        } else {
            return res.status(404).json({ success: false, message: 'Genre not found!' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, addGenre, deleteGenre, getGenres
};