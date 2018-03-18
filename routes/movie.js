const express = require('express');
const router = express.Router();

// Models
const Movie = require('../models/Movie');

router.post('/', (req, res, next) => {
  const { title, imdbScore, category, country, year } = req.body;

  const movie = new Movie(req.body);

  movie.save()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
