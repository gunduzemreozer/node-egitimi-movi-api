const express = require('express');
const HttpStatus = require('http-status-codes');

const router = express.Router();

// Models
const Movie = require('../models/Movie');

router.get('/', (req, res, next) => {
  Movie.find()
    .then(movies => { res.jsend.success({ movies }); })
    .catch(err => { next(err); });
});

// Top 10 List
router.get('/top10', (req, res, next) => {
  Movie.find()
    .sort({ imdbScore: -1 })
    .limit(10)
    .then(movies => { res.jsend.success({ movies }); })
    .catch(err => { next(err); });
});

//
router.get('/between/:startYear/:endYear', (req, res, next) => {
  const { startYear, endYear } = req.params;

  Movie.find({
    year: { '$gte': parseInt(startYear), '$lte': parseInt(endYear) }
  }).then(movies => { res.jsend.success({ movies }); })
  .catch(err => { next(err); });
});

router.get('/:movieId', (req, res, next) => {
  const promise = Movie.findById(req.params.movieId);

  promise.then(movie => { 
    if (!movie) {
      next({ message: 'The movie was not found.', status: HttpStatus.NOT_FOUND });
    } else {
      res.jsend.success({ movie }); 
    }
  }).catch(err => { next(err); });
});

router.post('/', (req, res, next) => {
  const { title, imdbScore, category, country, year } = req.body;

  const movie = new Movie(req.body);

  movie.save()
    .then(movie => {
      res.status(HttpStatus.CREATED)
        .set('location', `/api/movies/${movie._id}`)
        .jsend.success({ movie });
    })
    .catch(err => { next(err); });
});

router.put('/:movieId', (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(req.params.movieId, req.body, { new: true });

  promise.then(movie => {
    if (!movie) {
      next({ message: 'The movie was not found.', status: HttpStatus.NOT_FOUND });
    } else {
      res.jsend.success({ movie });
    }
  }).catch(err => { next(err); })
});

router.delete('/:movieId', (req, res, next) => {
  const promise = Movie.findByIdAndRemove(req.params.movieId);

  promise.then(movie => {
    if (!movie) {
      next({ message: 'The movie was not found.', status: HttpStatus.NOT_FOUND });
    } else {
      res.jsend.success({ movie });
    }
  }).catch(err => { next(err); })
});

module.exports = router;
