// Import necessary modules
var express = require('express');               // Express framework for routing and handling requests
var bodyParser = require("body-parser");        // Body parser to parse incoming request bodies
var app = express();                            // Initialize the Express application

// Define port for the server, using an environment variable or default to 5050
const PORT = process.env.PORT || 5050

// Define the start page (default to index.html)
var startPage = "index.html";

// Middleware to parse URL-encoded data and JSON bodies in the request
app.use(bodyParser.urlencoded({ extended: true }));           // Parses incoming request with URL-encoded payloads
app.use(bodyParser.json());                                   // Parses incoming request with JSON payloads
app.use(express.static("./public"));                          // Serve static files from the "public" directory

const statusMonitor = require('express-status-monitor');
app.use(statusMonitor());

// Import the functions to handle movie-related routes
const { addMovie, viewMovies_HuiQi, getGenres_HuiQi } = require('./utils/MovieUtils_HuiQi');
app.post('/addMovie', addMovie);
app.get('/viewMovies_HuiQi', viewMovies_HuiQi);
app.get('/getGenres_HuiQi', getGenres_HuiQi);
var express = require('express');
var bodyParser = require("body-parser");

const { viewMoviesKai, getGenresKai, viewMovieByGenre } = require('./utils/MovieUtil_Kai');
app.get('/viewMoviesKai', viewMoviesKai);
app.get('/getGenresKai', getGenresKai);
app.get('/viewMovieByGenre/:id', viewMovieByGenre);

const { addGenre, deleteGenre, getGenres } = require('./utils/genreUtil_Neston')
app.delete('/delete-genre/:id', deleteGenre);
app.post('/add-genre', addGenre);
app.get('/get-genres', getGenres);

const { editMovie, viewMovies, deleteMovie, viewMovieById, loadGenres } = require('./utils/Movieutil_jasper'); // Importing functions from Movieutil_jasper.js
app.get('/loadGenres', loadGenres); // view all genres
app.get('/viewMovies', viewMovies); // view all movies
app.get('/viewMovies/:id', viewMovieById); // view movie by id
app.put('/editMovie/:id', editMovie); // edit movie by id
app.delete('/deleteMovie/:id', deleteMovie); // delete movie by id


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
})

// Start the server and listen for incoming requests on the defined PORT
server = app.listen(PORT, function () {
    // Get the server's address and port
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' :
        address.address}:${address.port}`;

    // Log the base URL of the server to the console
    console.log(`Demo project at: ${baseUrl}`);
});

// Export app and server for potential use in testing or other modules
module.exports = { app, server }