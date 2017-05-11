'use strict';

const createError = require('http-errors');
const Promise = require('bluebird');
const Gallery = require('../models/gallery.js');

module.exports = exports = {};

exports.addPicture = function(req, res) {
  if(!req) return createError(400, 'Invalid body');
  req.body.userId = req.user._id;
  
  new Gallery(req.body).save()
  .then(gallery => res.json(gallery))
  .catch(err => {
    console.log(err);
    res.status(err.status).send(err.message);
  });
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
  
  Gallery.findOneAndUpdate(id, req.body, {new: true})
  .then(pic => res.json(pic))
  .catch(err => console.error(err));
};

exports.deletePicture = function(req, res, id) {
  if(!id) return Promise.reject(createError(400, 'ID required'));

  Gallery.findByIdAndRemove(id)
  .then(() => res.status(204).send())
  .catch(err => res.send(err));
};