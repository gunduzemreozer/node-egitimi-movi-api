const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');

const router = express.Router();

//Models
const User = require('../models/User');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10).then(hash => {
    const user = new User({
      username,
      password: hash
    });
  
    user.save()
      .then(user => { res.status(HttpStatus.CREATED).jsend.success({ user });})
      .catch(err => { next(err); });
  });  
});

router.post('/authenticate', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (!user) {
        next({ message: 'Authentication failed, user not found!', status: HttpStatus.NOT_FOUND });        
      }
      else {
        // Load hash from your password DB.
        bcrypt.compare(password, user.password).then(result => {
          if (!result) {
            next({ message: 'Authentication failed, wrong password!' });
          }
          else {
            const payload = {
              username
            };

            const token = jwt.sign(payload, 
              req.app.get('api_secret_key'), 
              {
                expiresIn: "1h"
              }
            );

            res.jsend.success({ token });
          }
        });
      }
    }).catch(err => {
      next(err);
    });
});

module.exports = router;
