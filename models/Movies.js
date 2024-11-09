class Movie {
    constructor(movie_name, poster_url, description, genre, rating, release_date) {
        this.movie_name = movie_name;
        this.poster_url = poster_url;
        this.description = description;
        this.genre = genre;
        this.rating = rating;
        this.release_date = release_date;

        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        this.id = timestamp + "" + random.toString().padStart(3, '0');
    }
}
module.exports = { Movie };