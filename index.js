var express = require('express'); 
var bodyParser = require("body-parser");
var app = express();
const PORT = process.env.PORT || 5050
var startPage = "index.html";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const { editMovie, viewMovies, deleteMovie, viewMovieById, loadGenres } = require('./utils/Movieutil_jasper'); // Importing functions from Movieutil_jasper.js
app.get('/loadGenres', loadGenres); // view all genres
app.get('/viewMovies', viewMovies); // view all movies
app.get('/viewMovies/:id', viewMovieById); // view movie by id
app.put ('/editMovie/:id', editMovie); // edit movie by id
app.delete('/deleteMovie/:id', deleteMovie); // delete movie by id

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
})
server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' :
        address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});
module.exports = { app, server }