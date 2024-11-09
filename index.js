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

// Import the functions to handle movie-related routes
const { addMovie, viewMovies, getGenres } = require('./utils/MovieUtils_HuiQi');
app.post('/addMovie', addMovie);
app.get('/viewMovies', viewMovies);
app.get('/getGenres', getGenres);

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