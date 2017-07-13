'use strict';

const Gallery = require('../model/gallery');
const createError = require('http-errors');
const Promise = require('bluebird');
module.exports = exports = {};

exports.createGallery = function(body, user) {
  body.userId = user._id;
  return new Gallery(body).save()
    .then(gallery => gallery)
    .catch(err => Promise.reject(createError(400, err.name)));
};


exports.fetchGallery = function(req) {
  return Gallery.findById(req.params.id)
    .then(gallery => {
      if(gallery.userId.toString() !== req.user._id.toString()) {
        return createError(401, 'Invalid user');
      }
      return gallery;
    })
    .catch(err => Promise.reject(createError(400, err.name)));
};

exports.fetchAll = function() {
  Gallery.find()
    .then(gallery => gallery)
    .catch(err => Promise.reject(createError(400, err.name)));
};

exports.updateGallery = function(req) {
  if(req.params.id) {
    return Gallery.findById(req.params.id, function(err, gallery) {
      if(err) return Promise.reject(createError(400, 'Bad Request'));
      gallery.name = req.body.name || gallery.name;
      gallery.desc = req.body.desc || gallery.desc;
      return gallery.save()
        .then(gallery => gallery)
        .catch(err => createError(400, console.error(err)));
    });
  }
};

exports.deleteGallery = function(req) {
  return Gallery.findByIdAndRemove(req.params.id)
    .catch(err => createError(400, console.error(err)));
};
