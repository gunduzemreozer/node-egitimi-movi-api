const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Node Server', () => {
    it('(GET /) anasayfayı döndürür', done => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('(GET /) movies endpoint', done => {
        done();
    });
});
