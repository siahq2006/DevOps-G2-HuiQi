const { describe, it } = require('mocha');
const { expect } = require('chai');
const { app, server } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);


let baseUrl;
describe('Movies API', () => {
    let consoleErrorSpy;

    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address == '::' ? 'localhost' : address}:${port}`;
    });
    after(() => {
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    let count = 0;
    let resourceId; // Variable to store the ID of the movies

    // Test Suite for viewing movies
    describe('GET /viewMovies_HuiQi', () => {
        it('should return all movies', (done) => {
            chai.request(baseUrl)
                .get('/viewMovies_HuiQi')
                .end((err, res) => {
                    count = res.body.length;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('GET /getGenres_HuiQi', () => {
        it('should return all movies', (done) => {
            chai.request(baseUrl)
                .get('/getGenres_HuiQi')
                .end((err, res) => {
                    count = res.body.length;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    genres = res.body;
                    done();
                });
        });
    });

    // Test Suite for adding movies
    describe('POST /addMovie', () => {
        it('should return 400 if all fields are not filled in', (done) => {
            chai.request(baseUrl)
                .post('/addMovie')
                .send({
                    movie_name: 'Test Movie',
                    poster_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vintagemovieposters.co.uk%2Fshop%2Favengers-movie-poster%2F&psig=AOvVaw0mtX5Pd-yRZXteC9Gzvr53&ust=1732676893784000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPj978iC-YkDFQAAAAAdAAAAABAE',
                    description: 'Hello World!!!',
                    genre: "",
                    rating: "4.5",
                    release_date: "2021-09-01",
                    duration: "123"
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('All fields are required!');
                    done();
                });
        });

        it('should return 400 if description is less than 10 characters long', (done) => {
            chai.request(baseUrl)
                .post('/addMovie')
                .send({
                    movie_name: 'Test Movie',
                    poster_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vintagemovieposters.co.uk%2Fshop%2Favengers-movie-poster%2F&psig=AOvVaw0mtX5Pd-yRZXteC9Gzvr53&ust=1732676893784000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPj978iC-YkDFQAAAAAdAAAAABAE',
                    description: 'short',
                    genre: genres[1].id,
                    rating: "4.5",
                    release_date: "2021-09-01",
                    duration: "123"
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Description must be at least 10 characters long!');
                    done();
                });
        });

        it('should return 400 if rating is less than 1 or more than 5', (done) => {
            chai.request(baseUrl)
                .post('/addMovie')
                .send({
                    movie_name: 'Test Movie',
                    poster_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vintagemovieposters.co.uk%2Fshop%2Favengers-movie-poster%2F&psig=AOvVaw0mtX5Pd-yRZXteC9Gzvr53&ust=1732676893784000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPj978iC-YkDFQAAAAAdAAAAABAE',
                    description: 'Hello World!!!',
                    genre: genres[1].id,
                    rating: "0",
                    release_date: "2021-09-01",
                    duration: "123"
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Rating must be a number between 1 and 5!');
                    done();
                });
        });

        it('should return 400 if release date is not in YYYY-MM-DD format', (done) => {
            chai.request(baseUrl)
                .post('/addMovie')
                .send({
                    movie_name: 'Test Movie',
                    poster_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vintagemovieposters.co.uk%2Fshop%2Favengers-movie-poster%2F&psig=AOvVaw0mtX5Pd-yRZXteC9Gzvr53&ust=1732676893784000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPj978iC-YkDFQAAAAAdAAAAABAE',
                    description: 'Hello World!!!',
                    genre: genres[1].id,
                    rating: "4.5",
                    release_date: "21-09-2001",
                    duration: "123"
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Release date must be in the format YYYY-MM-DD!');
                    done();
                });
        });

        it('should return 400 if duration is not positive', (done) => {
            chai.request(baseUrl)
                .post('/addMovie')
                .send({
                    movie_name: 'Test Movie',
                    poster_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vintagemovieposters.co.uk%2Fshop%2Favengers-movie-poster%2F&psig=AOvVaw0mtX5Pd-yRZXteC9Gzvr53&ust=1732676893784000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPj978iC-YkDFQAAAAAdAAAAABAE',
                    description: 'Hello World!!!',
                    genre: genres[1].id,
                    rating: "4.5",
                    release_date: "2021-09-01",
                    duration: "0"
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Duration must be a positive integer!');
                    done();
                });
        });

        it('should add a new movie', (done) => {
            console.log("Genres: ", genres); // Confirm genre availability
            chai.request(baseUrl)
                .get('/viewMovies_HuiQi')  // Ensure we get the count of movies before adding a new one
                .end((err, res) => {
                    if (err) done(err);

                    const countBeforeAdd = res.body.length; // Get the number of movies before adding

                    chai.request(baseUrl)
                        .post('/addMovie')
                        .send({
                            movie_name: 'Test Movie',
                            poster_url: 'https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg',
                            description: 'Hello World!!!',
                            genre: genres[1].id,
                            rating: "4.5",
                            release_date: "2021-09-01",
                            duration: "123"
                        })
                        .end((err, res) => {
                            expect(res).to.have.status(201);
                            expect(res.body).to.be.an('array'); // Ensure response is an array

                            const newCount = res.body.length; // Get the new count of movies
                            expect(newCount).to.equal(countBeforeAdd + 1); // Compare with the count before the add operation

                            resourceId = res.body[newCount - 1].id; // Store the ID of the newly added movie
                            done();
                        });
                });
        });

    });

});

