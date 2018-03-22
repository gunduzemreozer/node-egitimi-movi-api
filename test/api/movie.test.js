const chai = require('chai');
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
const server = require('../../app');


const should = chai.should();
const statusSuccess = 'success';

chai.use(chaiHttp);

let token, movieId;

describe('/api/movies tests', () => {
    before(done => {
        chai.request(server)
            .post('/authenticate')
            .send({ username: 'eozer', password: '12345678' })
            .end((err, res) => {
                token = `Bearer ${res.body.data.token}`;
                done();
            });
    });

    describe('/POST', () => {
        it('it should post a movie', done => {
            const movie = {
                title: 'Test Film',
                category: 'Suç',
                country: 'Türkiye',
                year: 2018,
                imdbScore: 7,
                director_id: '5aaebcf75b2c605d84708653'
            };

            chai.request(server)
                .post('/api/movies')
                .send(movie)
                .set('authorization', token)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(HttpStatus.CREATED);

                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(statusSuccess);
                    res.body.should.have.property('data').which.is.an('object')
                        .and.has.property('movie').which.is.an('object');

                    movieId = res.body.data.movie._id;

                    let regex = new RegExp(`${movieId}$`);
                    res.header.should.have.property('location').to.match(regex);

                    done();
                });
        });
    });

    describe('/GET', () => {
        it('it should GET all the movies', done => {
            chai.request(server)
                .get('/api/movies')
                .set('authorization', token)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(HttpStatus.OK);
                    
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(statusSuccess);
                    res.body.should.have.property('data').which.is.an('object')
                        .and.has.property('movies').which.is.an('array');

                    done();
                });
        });
    });

    describe('/GET /top10', () => {
        it('it should GET Top 10 List movies', done => {
            chai.request(server)
                .get('/api/movies/top10')
                .set('authorization', token)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(HttpStatus.OK);

                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(statusSuccess);
                    res.body.should.have.property('data').which.is.an('object')
                        .and.has.property('movies').which.is.an('array');

                    done();
                });
        });
    });

    describe('/GET /:movieId', () => {
        it('It should GET a movie by the given id', done => {
            chai.request(server)
                .get(`/api/movies/${movieId}`)
                .set('authorization', token)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(HttpStatus.OK);

                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(statusSuccess);
                    res.body.should.have.property('data').which.is.an('object')
                        .and.has.property('movie').which.is.an('object')
                        .and.has.property('_id').eql(movieId);

                    done();
                });
        });
    });

    describe('/GET /between/:startYear/:endYear', () => {
        it('It should GET movies between start year and end year', done => {
            chai.request(server)
                .get(`/api/movies/between/1900/2100`)
                .set('authorization', token)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(HttpStatus.OK);

                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(statusSuccess);
                    res.body.should.have.property('data')
                        .which.is.an('object')
                        .and.has.property('movies')
                        .which.is.an('array');

                    done();
                });
        });
    });

    describe('/PUT /:movieId', () => {
        it('it should update a movie given by id', done => {
            const movie = {
                title: 'Test Film2',
                category: 'Suç2',
                country: 'Türkiye2',
                year: 2019,
                imdbScore: 8,
                director_id: '5aaebd025b2c605d84708654'
            };

            chai.request(server)
                .put(`/api/movies/${movieId}`)
                .send(movie)
                .set('authorization', token)
                .end((err, res) => {
                    res.should.have.status(HttpStatus.OK);

                    res.body.should.be.a('object');
                    res.body.should.have.property('data').which.is.an('object')
                        .and.has.property('movie').which.is.an('object');

                    let movieRef = res.body.data.movie;
                    movieRef.should.have.property('title').eql(movie.title);
                    movieRef.should.have.property('category').eql(movie.category);
                    movieRef.should.have.property('country').eql(movie.country);
                    movieRef.should.have.property('year').eql(movie.year);
                    movieRef.should.have.property('imdbScore').eql(movie.imdbScore);
                    movieRef.should.have.property('director_id').eql(movie.director_id);

                    done();
                });
        });
    });

    describe('/DELETE /:movieId', () => {
        it('it should delete a movie given by id', done => {            
            chai.request(server)
                .delete(`/api/movies/${movieId}`)
                .set('authorization', token)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(HttpStatus.OK);

                    res.body.should.be.a('object');
                    res.body.should.have.property('data').which.is.an('object')
                        .and.has.property('movie').which.is.an('object')
                        .and.has.property('_id').eql(movieId);
                    
                    done();
                });
        });
    });
 });
