'use strict';

const Promise = require('bluebird');
const createError = require('http-errors');
const Gallery = require('../models/gallery');

module.exports = exports = {};

exports.createGallery = function(req, res, gallery, userId) {

  if(!gallery) return Promise.reject(createError(400, 'Bad request'));

  gallery.userId = userId;
  new Gallery(gallery).save()
  .then(gallery => res.json(gallery))
  .catch(err => {
    console.log(err);
  });
};

exports.fetchGallery = function(req, res, id, userId) {

  if(!id) return Promise.reject(createError(400, 'Bad request'));

  Gallery.findById(id)
  .then(gallery => {
    if(gallery.userId.toString() !== userId.toString()) {
      return createError(401, 'Invalid user');
    }
    res.json(gallery);
  })
  .catch(err => res.status(err.status).send(err.message));
};

exports.deleteGallery = function(rreq, res, id, userId) {

  if(!id) return Promise.reject(createError(400, 'bad request'));

  Gallery.findById(id)
  .then(gallery => {
    if(gallery.userId.toString() !== userId.toString()) {
      return createError(401, 'Invalid user');
    }
    res.json(gallery);
  })
  .catch(err => console.log(err));

  Gallery.findByIdAndRemove(id)
  .then( () => {
    res.sendStatus(204);
  })
  .catch(err => res.status(404).send(err.message));
};

exports.updateGallery = function(req, res, id, userId, gallery) {

  if(!id) return Promise.reject(createError(404, 'Not found'));

  Gallery.findByIdAndUpdate(id, gallery, {new: true})
  .then(gallery => {
    if(gallery.userId.toString() !== userId.toString()) {
      return createError(401, 'Invalid user');
    }
    res.json(gallery);
  })
  .catch(err => console.log('update failed', err));
};
