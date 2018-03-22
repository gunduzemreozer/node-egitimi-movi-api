const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // const token = req.headers['x-access-token'] || req.body.token || req.query.token;
    let token, headerTokenArray;
    if (req.headers.authorization && (headerTokenArray = req.headers.authorization.split(' '))[0] === 'Bearer') {
        token = headerTokenArray[1];
    } else {
        token = req.body.token || req.query.token;
    }

    if (token) {
        jwt.verify(token, 
            req.app.get('api_secret_key'),
            (err, decoded) => {
                if (err) {
                    res.status(401).jsend.fail({ token: 'Failed to authenticate token.' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
    } else {
        res.status(401).jsend.error('No token provided.');
    }
};