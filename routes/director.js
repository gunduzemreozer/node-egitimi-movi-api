const express = require('express');
const mongoose = require('mongoose');
const HttpStatus = require('http-status-codes');

const router = express.Router();

// Models
const Director = require('../models/Director');

router.get('/', (req, res, next) => {
    const promise = Director.aggregate([
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies'
            }
        }
    ]);

    promise.then(directors => { res.jsend.success({ directors });})
        .catch(err => { next(err); });
});

router.get('/:director_id', (req, res, next) => {
    const promise = Director.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.params.director_id)
            }
        },
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies'
            }
        }
    ]);

    promise.then(directors => { 
        if (directors.length === 1) {
            res.jsend.success({ director: directors[0] });
        } else {
            next({ message: 'The director was not found', status: HttpStatus.NOT_FOUND });
        }
    }).catch(err => { next(err); });
});

router.post('/', (req, res, next) => {
    const director = new Director(req.body);

    director.save()
        .then(director => { 
            res.status(HttpStatus.CREATED)
            .set('location', `/api/directors/${director._id}`)
            .jsend.success({ director }); })
        .catch(err => { next(err) });
});

router.put('/:director_id', (req, res, next) => {
    Director.findByIdAndUpdate(req.params.director_id, req.body, { new: true })
        .then(director => {
            if (!director) {
                next({ message: 'The director was not found', status: HttpStatus.NOT_FOUND });
            }
            else {
                res.jsend.success({ director });
            }
        }).catch(err => { next(err); });
});

router.delete('/:director_id', (req, res, next) => {
    Director.findByIdAndRemove(req.params.director_id)
        .then(director => {
            if (!director) {
                next({ message: 'The director was not found', status: HttpStatus.NOT_FOUND });
            } else {
                res.jsend.success({ director });
            }
        }).catch(err => { next(err); });
});

module.exports = router;
