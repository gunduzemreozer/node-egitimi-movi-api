const chai = require('chai');
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');

const server = require('../../app');

const should = chai.should();
const statusSuccess = 'success';

let token, directorId;

describe('/api/directors tests', () => {
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
        it('it should post a director', done => {
            const director = {
                name: 'Gündüz Emre',
                surname: 'Özer',
                bio: 'lorem ipsummmmm dolar sitamet lorem ipsummmmm dolar sitamet lorem ipsummmmm dolar sitamet lorem ipsummmmm dolar sitamet'
            };

            chai.request(server)
                .post('/api/directors')
                .send(director)
                .set('authorization', token)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(HttpStatus.CREATED);

                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(statusSuccess);
                    res.body.should.have.property('data').which.is.an('object')
                        .and.has.property('director').which.is.an('object');

                    directorId = res.body.data.director._id;

                    let regex = new RegExp(`${directorId}$`);
                    res.header.should.have.property('location').to.match(regex);

                    done();
                });
        });
    });

    describe('/GET', () => {
        it('it should get directors with films', done => {
            chai.request(server)
                .get('/api/directors')
                .set('authorization', token)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(HttpStatus.OK);

                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(statusSuccess);
                    res.body.should.have.property('data').which.is.an('object')
                        .and.has.property('directors').which.is.an('array');

                    done();
                });
        });
    });

    describe('/GET /:director_id', () => {
        it('it should get directors with films by director_id', done => {
            chai.request(server)
                .get(`/api/directors/${directorId}`)
                .set('authorization', token)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(HttpStatus.OK);

                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(statusSuccess);
                    res.body.should.have.property('data').which.is.an('object')
                        .and.has.property('director').which.is.an('object')
                        .and.has.property('_id').eql(directorId);

                    done();
                });
        });
    });

    describe('/PUT /:director_id', () => {
        it('it should update the director by given id', done => {
            const director = {
                name: 'Gündüz Emre - updated',
                surname: 'Özer - updated',
                bio: 'lorem ipsummmmm dolar sitamet lorem ipsummmmm dolar sitamet lorem ipsummmmm dolar sitamet lorem ipsummmmm dolar sitamet - updated'
            };
            
            chai.request(server)
                .put(`/api/directors/${directorId}`)
                .set('authorization', token)
                .send(director)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(HttpStatus.OK);

                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(statusSuccess);
                    res.body.should.have.property('data').which.is.an('object')
                        .and.has.property('director').which.is.an('object');
                    
                    let directorRef = res.body.data.director;
                    directorRef.should.have.property('_id', directorId);
                    directorRef.should.have.property('name', director.name);
                    directorRef.should.have.property('surname', director.surname);
                    directorRef.should.have.property('bio', director.bio);

                    done();
                });
        });
    });

    describe('/DELETE /:director_id', () => {
        it('it should delete the director by given id', done => {
            chai.request(server)
                .delete(`/api/directors/${directorId}`)
                .set('authorization', token)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(HttpStatus.OK);

                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(statusSuccess);
                    res.body.should.have.property('data').which.is.an('object')
                        .and.has.property('director').which.is.an('object')
                        .and.has.property('_id', directorId);

                    done();
                });
        });
    });
});