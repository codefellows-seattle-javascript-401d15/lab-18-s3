'use strict';

const Promise = require('bluebird');
const createError = require('http-errors');
const Gallery = require('../models/gallery');
const debug = require('debug')('cfgram:gallery-controller');

module.exports = exports = {};

exports.createGallery = function(req) {
  debug('#createGallery');
  console.log('BODY: ', req.body);
  console.log('USER?!: ', req.user);

  if(!req) return Promise.reject(createError(400, 'Bad request'));

  req.body.userId = req.user._id;
  return new Gallery(req.body).save()
  .then(gallery => gallery)
  .catch(err => createError(401, err.message));
};

exports.fetchGallery = function(req, res, id, userId) {
  debug('#fetchGallery');
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

exports.deleteGallery = function(res, id, userId) {
  debug('deleteGallery');
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
  debug('#updateGallery');
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
