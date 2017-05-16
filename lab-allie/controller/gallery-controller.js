'use strict';

const createError = require('http-errors');
const Promise = require('bluebird');
const Gallery = require('../models/gallery.js');

module.exports = exports = {};

exports.addPicture = function(req) {
  if(!req.body.name) return Promise.reject(createError(400, 'Invalid name property'));
  if(!req.body.desc) return Promise.reject(createError(400, 'Invalid desc property'));
  req.body.userId = req.user._id;
  
  return new Gallery(req.body).save()
  .then(gallery => gallery)
  .catch(err => Promise.reject(createError(400, err.message)));
};

exports.getPicture = function(req) {
  if(!req.params.id) return Promise.reject(createError(400, 'ID required'));
  
  return Gallery.findById(req.params.id)
  .catch(err => console.error(err));
};

exports.updatePicture = function(req) {
  if(!req.params.id) return Promise.reject(createError(400, 'ID required'));
  
  return Gallery.findOneAndUpdate(req.params.id, req.body, {new: true});
};

exports.deletePicture = function(req, res, id) {
  if(!id) return Promise.reject(createError(400, 'ID required'));

  return Gallery.findByIdAndRemove(id);
};