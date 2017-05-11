'use strict';

const Promise = require('bluebird');
const createError = require('http-errors');
const Gallery = require('../models/gallery');

module.exports = exports = {};

exports.createItem = function(req, res, gallery, userId) {

  if(!gallery) return Promise.reject(createError(400, 'Bad Request'));

  gallery.userId = userId;
  new Gallery(gallery).save()
  .then(gallery => res.json(gallery))
  .catch(err => res.status(err.status).send(err));

};

exports.fetchItem = function(req, res, id, userId) {

  if(!id) return Promise.reject(createError(400, 'Bad Request'));

  Gallery.findById(id)
  .then(gallery => {
    if(gallery.userId.toString() !== userId.toString()) {
      return createError(401, 'Invalid user');
    }
    res.json(gallery);
  })
  .catch(err => res.status(err.status).send(err.message));
};

exports.deleteItem = function(req, res, id, userId) {

  if(!id) return Promise.reject(createError(400, 'Bad Request'));

  Gallery.findById(id)
  .then(gallery => {
    if(gallery.userId.toString() !== userId.toString()) {
      return createError(401, 'Invalid user');
    }
    res.json(gallery);
  });
  Gallery.findByIdAndRemove(id)
  .then( () => {
    res.sendStatus(204);
  })
  .catch(err => res.status(err.status).send(err));

};

exports.updateItem = function(req, res, id, userId, gallery) {

  if(!id) return Promise.reject(createError(404, 'not found'));

  Gallery.findByIdAndUpdate(id, gallery, {new: true})
  .then(gallery => {
    if(gallery.userId.toString() !== userId.toString()) {
      return createError(401, 'Invalid user');
    }
    res.json(gallery);
  })
  .catch(err => res.status(err.status).send(err));
};
