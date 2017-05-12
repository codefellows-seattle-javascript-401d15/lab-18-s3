'use strict';

const createError = require('http-errors');
const Promise = require('bluebird');
const Gallery = require('../models/gallery.js');

module.exports = exports = {};

exports.addPicture = function(req) {
  console.log('Scott was here', req.body);
  if(!req.body.name) return Promise.reject(createError(400, 'Invalid name property'));
  if(!req.body.desc) return Promise.reject(createError(400, 'Invalid desc property'));
  req.body.userId = req.user._id;
  
  return new Gallery(req.body).save()
  .then(gallery => gallery)
  .catch(err => Promise.reject(createError(400, err.message)));
};

exports.getPicture = function(req, res, id, userId) {
  if(!id) return Promise.reject(createError(400, 'ID required'));
  
  Gallery.findById(id)
  .then(gallery => {
    if(gallery.userId.toString() !== userId.toString()) {
      return createError(401, 'Invalid user');
    }
    res.json(gallery);
  })
  .catch(err => console.error(err));
};

exports.updatePicture = function(req, res, gallery, id) {
  if(!gallery) return Promise.reject(createError(400, 'ID required'));
  
  Gallery.findOneAndUpdate(id, req.body, {new: true});
};

exports.deletePicture = function(req, res, id) {
  if(!id) return Promise.reject(createError(400, 'ID required'));

  Gallery.findByIdAndRemove(id);
};