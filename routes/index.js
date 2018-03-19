const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      .then(data => {
        res.json(data);
      }).catch(err => {
        res.json(err);
      });
  });  
});

router.post('/authenticate', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (!user) {
        next({ message: 'Authentication failed, user not found!', code: 2 });
      }
      else {
        // Load hash from your password DB.
        bcrypt.compare(password, user.password).then(result => {
          if (!result) {
            next({ message: 'Authentication failed, wrong password!', code: 3 });
          }
          else {
            const payload = {
              username
            };

            const token = jwt.sign(payload, 
              req.app.get('api_secret_key'), 
              {
                expiresIn: 720 //12 saat
              }
            );

            res.json({
              status: true,
              token
            });
          }
        });
      }
    }).catch(err => {
      res.json(err);
    });
});

module.exports = router;
