const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const HttpStatus = require('http-status-codes');

const should = chai.should();
const statusSuccess = 'success';

chai.use(chaiHttp);

describe('/ tests', () => {
    describe('/ Home Page test', () => {
        it('(GET /) returns the homepage', done => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    should.not.exist(err);
                    
                    res.should.have.status(HttpStatus.OK);
                    done();
                });
        });
    });

    const user = { username: `test${Date.now()}`, password: '12345678' };
    describe('/register POST User', () => {
        it('it should post a user', done => {
            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    should.not.exist(err);
                                        
                    res.should.have.status = HttpStatus.CREATED;
                    
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(statusSuccess);
                    res.body.should.have.property('data').should.be.a('object');
                    res.body.should.have.nested.property('data.user').should.be.a('object');
                    res.body.should.have.nested.property('data.user.username').eql(user.username);
                    res.body.should.have.nested.property('data.user.password').not.eql(user.password);

                    done();
                });
        });
    });

    describe('/authenticate POST User', () => {
        it('it should authenticate user and return token', done => {
            chai.request(server)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status = HttpStatus.OK;

                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(statusSuccess);
                    res.body.should.have.property('data').should.be.a('object');
                    res.body.should.have.nested.property('data.token').to.match(/^.+\..+\..+$/);

                    done();
                });
        });
    });
});