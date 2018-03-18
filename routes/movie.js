const express = require('express');
const router = express.Router();

// Models
const Movie = require('../models/Movie');

router.get('/', (req, res, next) => {
  Movie.find()
    .then(data => { res.json(data); })
    .catch(err => { res.json(err); });
});

// Top 10 List
router.get('/top10', (req, res, next) => {
  Movie.find()
    .sort({ imdbScore: -1 })
    .limit(10)
    .then(data => { res.json(data); })
    .catch(err => { res.json(err); });
});

//
router.get('/between/:startYear/:endYear', (req, res, next) => {
  const { startYear, endYear } = req.params;

  Movie.find({
    year: { '$gte': parseInt(startYear), '$lte': parseInt(endYear) }
  }).then(data => { res.json(data); })
  .catch(err => { res.json(err); });
});

router.get('/:movie_id', (req, res, next) => {
  const promise = Movie.findById(req.params.movie_id);

  promise.then(movie => { 
    if (!movie) {
      next({ message: 'The movie was not found.', code: 1 });
    } else {
      res.json(movie); 
    }
  }).catch(err => { 
    res.json(err) 
  });
});

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

router.put('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(req.params.movie_id, req.body, { new: true });

  promise.then(movie => {
    if (!movie) {
      next({ message: 'The movie was not found.', code: 1 });
    } else {
      res.json(movie);
    }
  }).catch(err => {
    res.json(err);
  })
});

router.delete('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndRemove(req.params.movie_id);

  promise.then(movie => {
    if (!movie) {
      next({ message: 'The movie was not found.', code: 1 });
    } else {
      res.json(movie);
    }
  }).catch(err => {
    res.json(err);
  })
});

module.exports = router;
