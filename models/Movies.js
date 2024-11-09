class Movie {
    constructor(movie_name, poster_url, description, genre, rating, release_data) {
        this.name = name;
        this.location = location;
        this.description = description;
        this.owner = owner;
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        this.id = timestamp + "" + random.toString().padStart(3, '0');
    }
}
module.exports = { Resource };