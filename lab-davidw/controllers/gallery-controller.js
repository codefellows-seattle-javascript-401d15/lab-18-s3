'use strict';

const Promise = require('bluebird');
const createError = require('http-errors');
const Gallery = require('../models/gallery');
const debug = require('debug')('cfgram:gallery-controller');

module.exports = exports = {};

exports.createGallery = function(req) {
  debug('#createGallery');
  if(!req) return Promise.reject(createError(400, 'Bad request'));

  req.body.userId = req.user._id;
  return new Gallery(req.body).save()
  .then(gallery => gallery)
  .catch(err => createError(401, err.message));
};

exports.fetchGallery = function(req) {
  debug('#fetchGallery');
  if(!req.user) return Promise.reject(createError(400, 'Bad request'));

  return Gallery.find(req.user, { _id : req.params.id})
  .then(gallery => gallery)
  .catch(err => createError(404, err.message));

};

exports.deleteGallery = function(req) {
  debug('deleteGallery');
  if(!req.user._id) return Promise.reject(createError(400, 'bad request'));
  if(!req.params.id) return Promise.reject(createError(400, 'bad request'));
  console.log('gallery and user ID here is: ', { _id: req.params.id, userId: req.user._id});

  return Gallery.findOneAndRemove({ _id: req.params.id, userId: req.user._id.toString()})
  .then(data => {
    console.log(data, 'do we hit here????');
    if (data === null) createError(404, 'Gallery not found');
  })
  .catch(err => createError(err.status, err.message));
};

exports.updateGallery = function(req) {
  debug('#updateGallery');
  if(!req.params.id) return Promise.reject(createError(400, 'Id required'));

  return Gallery.findOneAndUpdate({ _id: req.params.id, userId: req.user._id}, req.body, {new: true})
  .then(data => {
    if (data === null) return createError(404, 'Cannot find that Gallery to update');
    return data;
  })
  .catch(err => createError(err.status, err.message));
};
